export const DISCORD_USER_ID = "1490560992244007002";

export interface LanyardActivity {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  application_id?: string;
  timestamps?: { start?: number; end?: number };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  created_at: number;
  buttons?: string[];
}

export interface LanyardSpotify {
  track_id: string;
  timestamps: { start: number; end: number };
  album: string;
  album_art_url: string;
  artist: string;
  song: string;
}

export interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    display_name?: string;
    global_name?: string;
    avatar: string | null;
    banner?: string | null;
    accent_color?: number | null;
  };
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: LanyardActivity[];
  listening_to_spotify: boolean;
  spotify: LanyardSpotify | null;
  active_on_discord_desktop?: boolean;
  active_on_discord_mobile?: boolean;
  active_on_discord_web?: boolean;
}

export function avatarUrl(data: LanyardData): string {
  const { id, avatar } = data.discord_user;
  if (!avatar) return `https://cdn.discordapp.com/embed/avatars/0.png`;
  return `https://cdn.discordapp.com/avatars/${id}/${avatar}.${avatar.startsWith("a_") ? "gif" : "png"}?size=256`;
}

export function bannerUrl(data: LanyardData): string | null {
  const { id, banner } = data.discord_user;
  if (!banner) return null;
  return `https://cdn.discordapp.com/banners/${id}/${banner}.${banner.startsWith("a_") ? "gif" : "png"}?size=600`;
}

export function activityImageUrl(activity: LanyardActivity, key: "large_image" | "small_image"): string | null {
  const image = activity.assets?.[key];
  if (!image) return null;
  if (image.startsWith("mp:external/")) {
    return `https://media.discordapp.net/${image.replace("mp:", "")}`;
  }
  if (image.startsWith("spotify:")) {
    return `https://i.scdn.co/image/${image.replace("spotify:", "")}`;
  }
  if (activity.application_id) {
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${image}.png`;
  }
  return null;
}

export async function fetchLanyard(): Promise<LanyardData | null> {
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? (json.data as LanyardData) : null;
  } catch {
    return null;
  }
}
