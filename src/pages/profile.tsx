import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) router.push("/login");
      else setUser(user);
    };
    fetchUser();
  }, [router]);

  return (
    <div>
      <h1>Profile</h1>
      {user && <p>Welcome, {user.email}!</p>}
    </div>
  );
}
