import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VideoView, useVideoPlayer } from 'expo-video';
import { fetchHomepageDestinations } from '../lib/api';
import { Destination } from '../lib/types';

const { width } = Dimensions.get('window');

function getVideoUrl(destination: Destination) {
  return destination.heroVideoUrl || '';
}

function getImageUrl(destination: Destination) {
  return destination.heroImage?.asset?.url || '';
}

function DestinationHero({ destination }: { destination: Destination | null }) {
  const videoUrl = destination ? getVideoUrl(destination) : '';
  const imageUrl = destination ? getImageUrl(destination) : '';

  const player = useVideoPlayer(videoUrl || null, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = true;
  });

  useEffect(() => {
    let cancelled = false;

    async function startPlayback() {
      if (!videoUrl) {
        try {
          player.pause();
        } catch {}
        return;
      }

      try {
        player.loop = true;
        player.muted = true;
        player.currentTime = 0;

        const timer = setTimeout(() => {
          if (!cancelled) {
            player.play();
          }
        }, 120);

        return () => clearTimeout(timer);
      } catch {}
    }

    const cleanupPromise = startPlayback();

    return () => {
      cancelled = true;
      Promise.resolve(cleanupPromise).then((cleanup) => {
        if (typeof cleanup === 'function') cleanup();
      });
    };
  }, [player, videoUrl]);

  if (!destination) {
    return (
      <View style={styles.heroMediaFallback}>
        <LinearGradient
          colors={['#0B1022', '#101932', '#050816']}
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }

  return (
    <View style={styles.heroMediaWrap}>
      {videoUrl ? (
        <VideoView
          player={player}
          style={styles.heroMedia}
          nativeControls={false}
          contentFit="cover"
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />
      ) : imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.heroMedia} resizeMode="cover" />
      ) : (
        <View style={styles.heroMediaFallback}>
          <LinearGradient
            colors={['#0B1022', '#101932', '#050816']}
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}

      <LinearGradient
        colors={[
          'rgba(5,8,22,0.18)',
          'rgba(5,8,22,0.40)',
          'rgba(5,8,22,0.75)',
          'rgba(5,8,22,0.96)',
        ]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

function DestinationCard({
  item,
  active,
  onPress,
}: {
  item: Destination;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.destinationCard, active && styles.destinationCardActive]}
    >
      <Text style={styles.destinationCardTitle}>{item.title}</Text>
      <Text style={styles.destinationCardMeta}>
        {[item.region, item.country].filter(Boolean).join(', ') || 'Curated destination'}
      </Text>
      {!!item.summary && (
        <Text numberOfLines={2} style={styles.destinationCardSummary}>
          {item.summary}
        </Text>
      )}
    </Pressable>
  );
}

export default function HomeScreen() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadHomepage() {
      try {
        setLoading(true);
        const results = await fetchHomepageDestinations();

        const prioritized = [
          ...results.filter((item) => !!item.heroVideoUrl),
          ...results.filter((item) => !item.heroVideoUrl),
        ];

        if (mounted) {
          setDestinations(prioritized);
          setActiveIndex(0);
        }
      } catch {
        if (mounted) {
          setDestinations([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadHomepage();

    return () => {
      mounted = false;
    };
  }, []);

  const activeDestination = useMemo(
    () => destinations[activeIndex] || null,
    [destinations, activeIndex]
  );

  const handleStart = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    router.push('/intake');
  };

  const handleRecommendations = async () => {
    try {
      await Haptics.selectionAsync();
    } catch {}
    router.push('/recommendations');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        <DestinationHero destination={activeDestination} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.heroTop}>
            <View style={styles.wordmarkWrap}>
              <Text style={styles.wordmark}>LŌQÉ</Text>
            </View>

            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>CURATED TRAVEL INTELLIGENCE</Text>
            </View>

            <Text style={styles.heroTitle}>
              Experience the Essence of Luxury.
            </Text>

            <Text style={styles.heroSubtitle}>
              Welcome to LOQE — where travel is designed with taste, intention,
              and a deeper understanding of the person behind the journey.
            </Text>
          </View>

          <View style={styles.actionRow}>
            <Pressable onPress={handleStart} style={styles.primaryButton}>
              <LinearGradient
                colors={['#8B5CF6', '#5B7CFF', '#3AD7FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButtonGradient}
              >
                <Text style={styles.primaryButtonText}>Start Client Intake</Text>
              </LinearGradient>
            </Pressable>

            <Pressable onPress={handleRecommendations} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Open Recommendations</Text>
            </Pressable>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelEyebrow}>FEATURED DESTINATIONS</Text>
            <Text style={styles.panelTitle}>
              Handpicked for refined travel
            </Text>
            <Text style={styles.panelBody}>
              Discover destinations that reflect different moods, styles and luxury preferences.
            </Text>

            {loading ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator color="#FFFFFF" />
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.destinationRow}
              >
                {destinations.map((item, index) => (
                  <DestinationCard
                    key={item._id}
                    item={item}
                    active={index === activeIndex}
                    onPress={() => setActiveIndex(index)}
                  />
                ))}
              </ScrollView>
            )}
          </View>

          {activeDestination ? (
            <View style={styles.featureCard}>
              <Text style={styles.featureEyebrow}>NOW FEATURING</Text>
              <Text style={styles.featureTitle}>{activeDestination.title}</Text>
              <Text style={styles.featureMeta}>
                {[activeDestination.region, activeDestination.country].filter(Boolean).join(', ') ||
                  'Curated destination'}
              </Text>
              {!!activeDestination.summary && (
                <Text style={styles.featureSummary}>{activeDestination.summary}</Text>
              )}
            </View>
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#050816',
  },
  root: {
    flex: 1,
    backgroundColor: '#050816',
  },
  heroMediaWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  heroMedia: {
    ...StyleSheet.absoluteFillObject,
  },
  heroMediaFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0A1024',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  heroTop: {
    marginTop: 8,
    paddingTop: 8,
  },
  wordmarkWrap: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  wordmark: {
    color: '#F4E5DF',
    fontSize: 46,
    lineHeight: 52,
    fontWeight: '400',
    letterSpacing: 1.2,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 16,
  },
  heroBadgeText: {
    color: '#E3EAFE',
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '800',
    letterSpacing: -1,
    maxWidth: '95%',
  },
  heroSubtitle: {
    marginTop: 14,
    color: 'rgba(230,236,255,0.82)',
    fontSize: 15.5,
    lineHeight: 24,
    maxWidth: '94%',
  },
  actionRow: {
    marginTop: 22,
    gap: 12,
  },
  primaryButton: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  secondaryButton: {
    paddingVertical: 17,
    paddingHorizontal: 18,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  secondaryButtonText: {
    color: '#E3EAFE',
    fontSize: 14,
    fontWeight: '700',
  },
  panel: {
    marginTop: 22,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  panelEyebrow: {
    color: '#9DB1F7',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  panelTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
  },
  panelBody: {
    color: 'rgba(227,233,255,0.76)',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },
  loadingWrap: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationRow: {
    paddingTop: 16,
    paddingRight: 8,
    gap: 12,
  },
  destinationCard: {
    width: Math.min(width * 0.72, 300),
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(7,10,20,0.52)',
  },
  destinationCardActive: {
    borderColor: 'rgba(194,167,122,0.45)',
    backgroundColor: 'rgba(194,167,122,0.12)',
  },
  destinationCardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  destinationCardMeta: {
    color: 'rgba(227,233,255,0.70)',
    fontSize: 13,
    marginTop: 6,
  },
  destinationCardSummary: {
    color: 'rgba(227,233,255,0.78)',
    fontSize: 13.5,
    lineHeight: 20,
    marginTop: 10,
  },
  featureCard: {
    marginTop: 18,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(5,8,22,0.55)',
  },
  featureEyebrow: {
    color: '#9DB1F7',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  featureTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
  },
  featureMeta: {
    color: 'rgba(227,233,255,0.70)',
    fontSize: 14,
    marginTop: 6,
  },
  featureSummary: {
    color: 'rgba(227,233,255,0.82)',
    fontSize: 14.5,
    lineHeight: 22,
    marginTop: 12,
  },
});