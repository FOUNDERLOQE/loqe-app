import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createTripBrief } from '../lib/api';
import {
  ClientProfileField,
  clientProfileSchema,
} from '../lib/clientProfileSchema';
import { buildAutoSummary, buildIntakePayload } from '../lib/intake';
import {
  buildInitialClientProfileState,
  getSectionCompletionCount,
} from '../lib/profileForm';
import { ClientProfileData, IntakeFormValues } from '../lib/types';

const tripTypeOptions = [
  'Holiday',
  'Honeymoon',
  'Celebration',
  'Family Vacation',
  'Wellness Retreat',
  'Romantic Escape',
];

const budgetOptions = ['$$$', '$$$$', '$$$$$'];

const initialForm: IntakeFormValues = {
  clientName: '',
  tripType: '',
  originCity: '',
  tripLengthDays: '',
  travellerCount: '',
  budgetBand: '',
  notes: '',
};

const defaultAnnualRow = {
  year: '',
  majorLifeChanges: '',
  updatedTravelPreferences: '',
  upcomingImportantDates: '',
};

function ChipOption({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export default function IntakeScreen() {
  const [form, setForm] = useState<IntakeFormValues>(initialForm);
  const [clientProfile, setClientProfile] = useState<ClientProfileData>(
    buildInitialClientProfileState()
  );
  const [saving, setSaving] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const currentSection = clientProfileSchema[currentSectionIndex];
  const autoSummary = useMemo(() => buildAutoSummary(form), [form]);

  function updateField<K extends keyof IntakeFormValues>(key: K, value: IntakeFormValues[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function updateProfileField(key: string, value: unknown) {
    setClientProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function toggleCheckbox(key: string, option: string) {
    const current = Array.isArray(clientProfile[key]) ? (clientProfile[key] as string[]) : [];
    const next = current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option];

    updateProfileField(key, next);
  }

  function updateAnnualRow(index: number, fieldKey: string, fieldValue: string) {
    const rows = Array.isArray(clientProfile.annualReviewLog)
      ? [...(clientProfile.annualReviewLog as Record<string, string>[])]
      : [{ ...defaultAnnualRow }];

    rows[index] = { ...rows[index], [fieldKey]: fieldValue };
    updateProfileField('annualReviewLog', rows);
  }

  function addAnnualRow() {
    const rows = Array.isArray(clientProfile.annualReviewLog)
      ? [...(clientProfile.annualReviewLog as Record<string, string>[])]
      : [];

    updateProfileField('annualReviewLog', [...rows, { ...defaultAnnualRow }]);
  }

  function goNextSection() {
    if (currentSectionIndex < clientProfileSchema.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
    }
  }

  function goPrevSection() {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);

      const payload = buildIntakePayload(form, clientProfile);
      const result = await createTripBrief(payload);

      Alert.alert('Saved', 'Client profile saved successfully.', [
        {
          text: 'Continue',
          onPress: () => {
            router.push({
              pathname: '/recommendations',
              params: {
                profileId: result.id,
                clientName: form.clientName,
                tripType: form.tripType,
                originCity: form.originCity,
                tripLengthDays: form.tripLengthDays,
                travellerCount: form.travellerCount,
                budgetBand: form.budgetBand,
                clientProfileSnapshot: JSON.stringify(clientProfile),
              },
            });
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to save client profile');
    } finally {
      setSaving(false);
    }
  }

  function renderField(field: ClientProfileField) {
    if (field.type === 'text') {
      return (
        <View key={field.key} style={styles.fieldWrap}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            style={styles.input}
            value={String(clientProfile[field.key] || '')}
            onChangeText={(value) => updateProfileField(field.key, value)}
            placeholder={field.label}
            placeholderTextColor="rgba(255,255,255,0.35)"
          />
        </View>
      );
    }

    if (field.type === 'textarea') {
      return (
        <View key={field.key} style={styles.fieldWrap}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={String(clientProfile[field.key] || '')}
            onChangeText={(value) => updateProfileField(field.key, value)}
            multiline
            placeholder={field.label}
            placeholderTextColor="rgba(255,255,255,0.35)"
          />
        </View>
      );
    }

    if (field.type === 'radio') {
      return (
        <View key={field.key} style={styles.fieldWrap}>
          <Text style={styles.label}>{field.label}</Text>
          <View style={styles.chipGroup}>
            {field.options.map((option) => (
              <ChipOption
                key={option}
                label={option}
                active={clientProfile[field.key] === option}
                onPress={() => updateProfileField(field.key, option)}
              />
            ))}
          </View>
        </View>
      );
    }

    if (field.type === 'radioWithOther') {
      const selected = String(clientProfile[field.key] || '');

      return (
        <View key={field.key} style={styles.fieldWrap}>
          <Text style={styles.label}>{field.label}</Text>
          <View style={styles.chipGroup}>
            {field.options.map((option) => (
              <ChipOption
                key={option}
                label={option}
                active={selected === option}
                onPress={() => updateProfileField(field.key, option)}
              />
            ))}
          </View>

          {selected === 'Other' && (
            <TextInput
              style={[styles.input, { marginTop: 10 }]}
              value={String(clientProfile[`${field.key}Other`] || '')}
              onChangeText={(value) => updateProfileField(`${field.key}Other`, value)}
              placeholder="Other"
              placeholderTextColor="rgba(255,255,255,0.35)"
            />
          )}
        </View>
      );
    }

    if (field.type === 'checkbox') {
      const selected = Array.isArray(clientProfile[field.key])
        ? (clientProfile[field.key] as string[])
        : [];

      return (
        <View key={field.key} style={styles.fieldWrap}>
          <Text style={styles.label}>{field.label}</Text>
          <View style={styles.chipGroup}>
            {field.options.map((option) => (
              <ChipOption
                key={option}
                label={option}
                active={selected.includes(option)}
                onPress={() => toggleCheckbox(field.key, option)}
              />
            ))}
          </View>
        </View>
      );
    }

    if (field.type === 'arrayOfObjects') {
      const rows = Array.isArray(clientProfile[field.key])
        ? (clientProfile[field.key] as Record<string, string>[])
        : [{ ...defaultAnnualRow }];

      return (
        <View key={field.key} style={styles.fieldWrap}>
          <Text style={styles.label}>{field.label}</Text>

          <View style={styles.stack}>
            {rows.map((row, rowIndex) => (
              <View key={`${field.key}-${rowIndex}`} style={styles.nestedCard}>
                {field.columns.map((col) => (
                  <View key={col.key} style={styles.fieldWrap}>
                    <Text style={styles.label}>{col.label}</Text>
                    <TextInput
                      style={[
                        styles.input,
                        col.key === 'year' ? undefined : styles.textareaSmall,
                      ]}
                      value={String(row[col.key] || '')}
                      onChangeText={(value) => updateAnnualRow(rowIndex, col.key, value)}
                      multiline={col.key !== 'year'}
                      placeholder={col.label}
                      placeholderTextColor="rgba(255,255,255,0.35)"
                    />
                  </View>
                ))}
              </View>
            ))}
          </View>

          <Pressable style={styles.secondaryButton} onPress={addAnnualRow}>
            <Text style={styles.secondaryButtonText}>Add Review Year</Text>
          </Pressable>
        </View>
      );
    }

    return null;
  }

  const sectionProgress = getSectionCompletionCount(currentSection.id, clientProfile);
  const overallProgressLabel = `${currentSectionIndex + 1}/${clientProfileSchema.length}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>INTAKE</Text>
        <Text style={styles.title}>Build the client story before the itinerary</Text>
        <Text style={styles.body}>
          Core trip context first, then the full LOQE personality profile in a guided mobile flow.
        </Text>

        <View style={styles.progressCard}>
          <Text style={styles.progressEyebrow}>QUESTIONNAIRE PROGRESS</Text>
          <Text style={styles.progressTitle}>
            Section {overallProgressLabel}: {currentSection.title}
          </Text>
          <Text style={styles.progressBody}>
            {sectionProgress.completed} of {sectionProgress.total} prompts completed in this section.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Trip Context</Text>

          <Text style={styles.label}>Client name</Text>
          <TextInput
            style={styles.input}
            value={form.clientName}
            onChangeText={(value) => updateField('clientName', value)}
            placeholder="Rushabh Loke"
            placeholderTextColor="rgba(255,255,255,0.35)"
          />

          <Text style={styles.label}>Trip type</Text>
          <View style={styles.chipGroup}>
            {tripTypeOptions.map((option) => (
              <ChipOption
                key={option}
                label={option}
                active={form.tripType === option}
                onPress={() => updateField('tripType', option)}
              />
            ))}
          </View>

          <Text style={styles.label}>Origin city</Text>
          <TextInput
            style={styles.input}
            value={form.originCity}
            onChangeText={(value) => updateField('originCity', value)}
            placeholder="Mumbai"
            placeholderTextColor="rgba(255,255,255,0.35)"
          />

          <Text style={styles.label}>Trip length (days)</Text>
          <TextInput
            style={styles.input}
            value={form.tripLengthDays}
            onChangeText={(value) => updateField('tripLengthDays', value)}
            keyboardType="number-pad"
            placeholder="7"
            placeholderTextColor="rgba(255,255,255,0.35)"
          />

          <Text style={styles.label}>Traveller count</Text>
          <TextInput
            style={styles.input}
            value={form.travellerCount}
            onChangeText={(value) => updateField('travellerCount', value)}
            keyboardType="number-pad"
            placeholder="2"
            placeholderTextColor="rgba(255,255,255,0.35)"
          />

          <Text style={styles.label}>Budget band</Text>
          <View style={styles.chipGroup}>
            {budgetOptions.map((option) => (
              <ChipOption
                key={option}
                label={option}
                active={form.budgetBand === option}
                onPress={() => updateField('budgetBand', option)}
              />
            ))}
          </View>

          <Text style={styles.label}>Planner notes</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={form.notes}
            onChangeText={(value) => updateField('notes', value)}
            multiline
            placeholder="Anything useful from the conversation that should influence recommendations."
            placeholderTextColor="rgba(255,255,255,0.35)"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{currentSection.title}</Text>
          <Text style={styles.sectionSubtitle}>{currentSection.subtitle}</Text>

          <View style={styles.stack}>{currentSection.fields.map(renderField)}</View>

          <View style={styles.sectionNavRow}>
            <Pressable
              style={[styles.secondaryButton, currentSectionIndex === 0 && styles.disabledButton]}
              onPress={goPrevSection}
              disabled={currentSectionIndex === 0}
            >
              <Text style={styles.secondaryButtonText}>Previous</Text>
            </Pressable>

            {currentSectionIndex < clientProfileSchema.length - 1 ? (
              <Pressable style={styles.secondaryButton} onPress={goNextSection}>
                <Text style={styles.secondaryButtonText}>Next Section</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.secondaryButton} onPress={() => setCurrentSectionIndex(0)}>
                <Text style={styles.secondaryButtonText}>Back to Start</Text>
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.previewCard}>
          <Text style={styles.previewLabel}>Auto-generated brief summary</Text>
          <Text style={styles.previewSummary}>{autoSummary}</Text>
        </View>

        <Pressable style={styles.primaryButton} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#050816" />
          ) : (
            <Text style={styles.primaryButtonText}>Save and generate recommendations</Text>
          )}
        </Pressable>
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
    marginBottom: 20,
  },
  progressCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(93,124,255,0.22)',
    backgroundColor: 'rgba(93,124,255,0.08)',
    marginBottom: 16,
  },
  progressEyebrow: {
    color: '#9DB1F7',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  progressTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  progressBody: {
    color: 'rgba(227,233,255,0.76)',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },
  card: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 16,
  },
  nestedCard: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  sectionSubtitle: {
    color: 'rgba(227,233,255,0.72)',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 10,
  },
  fieldWrap: {
    marginTop: 10,
  },
  label: {
    color: '#DDE6FF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: '#111114',
    color: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
  },
  textarea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  textareaSmall: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'transparent',
  },
  chipActive: {
    backgroundColor: '#F5F1E8',
    borderColor: '#F5F1E8',
  },
  chipText: {
    color: '#F5F1E8',
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#0F0F10',
  },
  stack: {
    gap: 12,
  },
  previewCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 18,
  },
  previewLabel: {
    color: '#9DB1F7',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  previewSummary: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 24,
  },
  sectionNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 18,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(194,167,122,0.28)',
    backgroundColor: 'rgba(194,167,122,0.08)',
  },
  secondaryButtonText: {
    color: '#E3D2B5',
    fontSize: 14,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.4,
  },
  primaryButton: {
    backgroundColor: '#F5F1E8',
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#0F0F10',
    fontSize: 15,
    fontWeight: '800',
  },
});