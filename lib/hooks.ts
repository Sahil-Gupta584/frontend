import { account } from "@/appwrite/clientConfig";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "./types";

export const useTimeZones = () => {
  const [timeZones, setTimeZones] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  useEffect(() => {
    const updateTimeZones = () => {
      const now = new Date();
      const zones = Intl.supportedValuesOf("timeZone").map((timeZone) => {
        try {
          // Format the time in this timezone
          const timeStr = now.toLocaleTimeString("en-US", {
            timeZone,
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });

          // Format the timezone name for display
          const parts = timeZone.split("/");
          let displayName = timeZone.replace(/_/g, " ");

          if (parts.length > 1) {
            displayName = `${parts[0]} - ${parts[parts.length - 1].replace(/_/g, " ")}`;
          }

          return {
            value: timeZone,
            label: timeStr,
          };
        } catch (e) {
          return {
            value: timeZone,
            label: timeZone,
          };
        }
      });

      // Sort timezones alphabetically
      zones.sort((a, b) => a.label.localeCompare(b.label));
      setTimeZones(zones);
    };

    // Initial update
    updateTimeZones();

    // Update every minute to keep times current
    const interval = setInterval(updateTimeZones, 60000);

    return () => clearInterval(interval);
  }, []);

  return timeZones;
};

export function useUser() {
  const router = useRouter();
  const path = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    account
      .get()
      .then(async (data) => {
        if (!data.$id && path?.includes("/dashboard")) {
          router.push(`/auth?redirect=${path}`);
          return;
        }

        if (path === "/auth" && data.$id) {
          router.push("/dashboard");
          return;
        }
        if (!data.prefs.image) {
          const session = await account.getSession("current");
          const res = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: {
                Authorization: `Bearer ${session.providerAccessToken}`,
              },
            }
          );
          const profile = await res.json();
          await account.updatePrefs({ image: profile.picture });
        }

        setUser({ ...data, image: data.prefs.image });
      })
      .catch(() => {
        if (path?.includes("/dashboard")) {
          router.push(`/auth?redirect=${path}`);
        }
      });
  }, [path, router]);

  return user;
}
