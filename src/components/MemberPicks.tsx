import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/hooks/useSession';
import { Lock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ExclusiveWine {
  id: number;
  title: string;
  price: number | string;
  image_url: string;
  member_blurb: string | null;
  features: { type?: string; grape?: string } | null;
}

// The RLS money beat. This component always asks for `exclusive = true` wines.
// Signed out, the anon RLS policy returns nothing -> the locked panel shows.
// Sign in, and the SAME query returns the bottles, because the member policy lets
// authenticated users see them. The rows weren't hidden by the UI -- they did not
// exist for the anonymous request. Enforced in the database, one policy.
export function MemberPicks() {
  const { session } = useSession();
  const [wines, setWines] = useState<ExclusiveWine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    supabase
      .from('wines')
      .select('id, title, price, image_url, member_blurb, features')
      .eq('exclusive', true)
      .order('price', { ascending: false })
      .then(({ data }) => {
        if (!cancelled) {
          setWines((data as ExclusiveWine[]) ?? []);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [session]);

  const locked = !session || wines.length === 0;

  return (
    <section id="discover" className="w-full max-w-5xl mx-auto px-4 mt-16 mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground tracking-tight">
          Exclusive Picks
        </h2>
        <span className="font-body text-xs uppercase tracking-widest text-muted-foreground">
          {session ? 'Members only' : 'Locked'}
        </span>
      </div>

      {locked ? (
        <div className="rounded-2xl border border-dashed border-primary/30 bg-card/40 p-12 flex flex-col items-center text-center gap-3">
          <Lock className="w-8 h-8 text-primary/70" />
          <p className="font-body text-sm text-foreground">
            Our allocated, members-only bottles live behind the club door.
          </p>
          <p className="font-body text-xs text-muted-foreground">
            Sign in as a member to unlock them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wines.map((w) => (
            <div key={w.id}
              className="rounded-2xl border border-primary/30 bg-card overflow-hidden hover:border-primary/60 transition-colors flex flex-col">
              <div className="bg-white h-44 flex items-center justify-center p-4">
                {w.image_url
                  ? <img src={w.image_url} alt={w.title}
                      className="h-full w-auto object-contain mix-blend-multiply" />
                  : <span className="text-muted-foreground text-xs uppercase tracking-widest">No image</span>}
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-semibold text-foreground leading-tight">{w.title}</h3>
                  {w.price && <span className="font-body text-sm font-bold text-primary shrink-0">${w.price}</span>}
                </div>
                {w.member_blurb && (
                  <div className="font-body text-sm text-muted-foreground leading-relaxed [&_p]:mb-2 [&_strong]:font-semibold [&_strong]:text-foreground [&_em]:italic">
                    <ReactMarkdown>{w.member_blurb}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {loading && !locked && (
        <p className="text-center text-muted-foreground text-xs mt-4">Loading the cellar...</p>
      )}
    </section>
  );
}
