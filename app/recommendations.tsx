import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  createItineraryDraft,
  fetchDestinations,
  saveRecommendationSnapshot,
} from '../lib/api';
import { scoreDestinations } from '../lib/scoreDestinations';
import { buildSignals, buildTravelStyleSummary } from '../lib/signals';
import {
  ClientProfileData,
  Destination,
  IntakeFormValues,
  RecommendedDestination,
  RecommendationSnapshotItem,
} from '../lib/types';

function normalizeSlug(value: Destination['slug']) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.current || '';
}

export default function RecommendationsScreen() {
  const params = useLocalSearchParams<{
    profileId?: string;
    clientName?: string;
    tripType?: string;
    originCity?: string;
    tripLengthDays?: string;
    travellerCount?: string;
    budgetBand?: string;
    clientProfileSnapshot?: string;
  }>();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSnapshot, setSavingSnapshot] = useState(false);
  const [creatingItineraryId, setCreatingItineraryId] = useState<string | null>(null);

  const formValues: IntakeFormValues = {
    clientName: String(params.clientName || ''),
    tripType: String(params.tripType || ''),
    originCity: String(params.originCity || ''),
    tripLengthDays: String(params.tripLengthDays || ''),
    travellerCount: String(params.travellerCount || ''),
    budgetBand: String(params.budgetBand || ''),
    notes: '',
  };

  const clientProfile: ClientProfileData = useMemo(() => {
    try {
      return params.clientProfileSnapshot ? JSON.parse(String(params.clientProfileSnapshot)) : {};
    } catch {
      return {};
    }
  }, [params.clientProfileSnapshot]);

  const signals = useMemo(() => buildSignals(formValues, clientProfile), [formValues, clientProfile]);
  const travelStyleSummary = useMemo(
    () => buildTravelStyleSummary(clientProfile),
    [clientProfile]
  );

  const recommendations: RecommendedDestination[] = useMemo(
    () => scoreDestinations(destinations, signals).slice(0, 6),
    [destinations, signals]
  );

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const results = await fetchDestinations();
        if (active) setDestinations(results);
      } catch (error: any) {
        Alert.alert('Error', error?.message || 'Failed to load destinations');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  async function handleSaveSnapshot() {
    if (!params.profileId) {
      Alert.alert('Missing profile', 'Save the intake first before saving recommendations.');
      return;
    }

    try {
      setSavingSnapshot(true);

      const topDestinations: RecommendationSnapshotItem[] = recommendations.map((item) => ({
        destinationId: item._id,
        title: item.title || '',
        slug: normalizeSlug(item.slug),
        country: item.country || '',
        region: item.region || '',
        budgetBand: item.budgetBand || '',
        recommendationScore: item.recommendationScore,
        matchReasons: item.matchReasons || [],
        matchWarnings: item.matchWarnings || [],
      }));

      await saveRecommendationSnapshot(String(params.profileId), topDestinations);
      Alert.alert('Saved', 'Recommendation snapshot saved successfully.');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to save recommendation snapshot');
    } finally {
      setSavingSnapshot(false);
    }
  }

  async function handleCreateItinerary(item: RecommendedDestination) {
    if (!params.profileId) {
      Alert.alert('Missing profile', 'Save the intake first before creating an itinerary draft.');
      return;
    }

    try {
      setCreatingItineraryId(item._id);

      await createItineraryDraft({
        profileId: String(params.profileId),
        profile: {
          clientName: formValues.clientName,
          tripType: formValues.tripType,
          originCity: formValues.originCity,
          tripLengthDays: Number(formValues.tripLengthDays) || 5,
          travellerCount: Number(formValues.travellerCount) || 0,
          budgetBand: formValues.budgetBand,
        },
        destination: {
          title: item.title || '',
          slug: normalizeSlug(item.slug),
        },
        recommendation: {
          recommendationScore: item.recommendationScore,
          matchReasons: item.matchReasons,
        },
        travelStyleSummary,
      });

      Alert.alert('Success', 'Itinerary draft created successfully.');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to create itinerary draft');
    } finally {
      setCreatingItineraryId(null);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.kicker}>RECOMMENDATIONS</Text>
        <Text style={styles.title}>Destination matches for this client</Text>
        <Text style={styles.body}>
          Top destinations scored using the same recommendation logic as your web flow.
        </Text>

        <View style={styles.briefCard}>
          <Text style={styles.briefLabel}>Client snapshot</Text>
          <Text style={styles.briefText}>
            {formValues.clientName || 'Client'} • {formValues.tripType || 'Trip type pending'} •{' '}
            {formValues.originCity || 'Origin pending'} • {formValues.tripLengthDays || '0'} days •{' '}
            {formValues.travellerCount || '0'} travellers • {formValues.budgetBand || 'Budget pending'}
          </Text>
        </View>

        <Pressable style={styles.saveButton} onPress={handleSaveSnapshot} disabled={savingSnapshot}>
          {savingSnapshot ? (
            <ActivityIndicator color="#0F0F10" />
          ) : (
            <Text style={styles.saveButtonText}>Save Recommendation Snapshot</Text>
          )}
        </Pressable>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color="#FFFFFF" />
          </View>
        ) : (
          recommendations.map((item) => (
            <View key={item._id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardMeta}>
                    {[item.region, item.country].filter(Boolean).join(', ') || 'Location pending'}
                  </Text>
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreBadgeText}>{item.recommendationScore}</Text>
                </View>
              </View>

              {!!item.summary && <Text style={styles.summary}>{item.summary}</Text>}

              <Text style={styles.sectionLabel}>Why this matches</Text>
              {(item.matchReasons || []).length ? (
                item.matchReasons.slice(0, 5).map((reason) => (
                  <Text key={reason} style={styles.reasonText}>• {reason}</Text>
                ))
              ) : (
                <Text style={styles.reasonText}>• No explicit reasons generated.</Text>
              )}

              {(item.matchWarnings || []).length > 0 && (
                <>
                  <Text style={styles.sectionLabel}>Watchouts</Text>
                  {item.matchWarnings.slice(0, 3).map((warning) => (
                    <Text key={warning} style={styles.warningText}>• {warning}</Text>
                  ))}
                </>
              )}

              <Pressable
                style={styles.itineraryButton}
                onPress={() => handleCreateItinerary(item)}
                disabled={creatingItineraryId === item._id}
              >
                {creatingItineraryId === item._id ? (
                  <ActivityIndicator color="#0F0F10" />
                ) : (
                  <Text style={styles.itineraryButtonText}>Create Itinerary Draft</Text>
                )}
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#050816',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  backText: {
    color: '#DDE6FF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 14,
  },
  kicker: {
    color: '#9DB1F7',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
  },
  body: {
    color: 'rgba(227,233,255,0.76)',
    fontSize: 15,
    lineHeight: 24,
    marginTop: 10,
    marginBottom: 18,
  },
  briefCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 14,
  },
  briefLabel: {
    color: '#9DB1F7',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  briefText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 24,
  },
  saveButton: {
    backgroundColor: '#F5F1E8',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  saveButtonText: {
    color: '#0F0F10',
    fontSize: 14,
    fontWeight: '800',
  },
  loadingWrap: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  card: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 16,
  },
  cardTop: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  cardMeta: {
    color: 'rgba(227,233,255,0.68)',
    fontSize: 13,
    marginTop: 6,
  },
  scoreBadge: {
    minWidth: 52,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(214,188,139,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBadgeText: {
    color: '#F3DDAF',
    fontSize: 14,
    fontWeight: '800',
  },
  summary: {
    color: 'rgba(227,233,255,0.78)',
    fontSize: 14.5,
    lineHeight: 22,
    marginTop: 14,
    marginBottom: 12,
  },
  sectionLabel: {
    color: '#DDE6FF',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 6,
  },
  reasonText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 22,
  },
  warningText: {
    color: '#F3DDAF',
    fontSize: 14,
    lineHeight: 22,
  },
  itineraryButton: {
    backgroundColor: '#F5F1E8',
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  itineraryButtonText: {
    color: '#0F0F10',
    fontSize: 14,
    fontWeight: '800',
  },
});