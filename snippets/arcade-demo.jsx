/* Arcade interactive product demos.

   Arcade hands out a raw HTML embed from its share dialog. That block cannot be
   pasted into MDX as-is: MDX parses HTML as JSX, so `style="..."` strings,
   lowercase `frameborder`, and the `<!--ARCADE EMBED-->` comments that wrap it
   are all parse errors. This component is that block, translated once.

   `aspect` is the percentage Arcade bakes into its own padding-bottom, and it
   differs per recording — read it off the embed code rather than assuming. The
   41px Arcade adds on top of it is the demo's chrome bar, which sits outside
   the recorded frame and does not scale with it.

   The embed is pinned to `embed_desktop=inline` and `embed_mobile=tab`, both
   Arcade's own recommendation. Inline is what a reader following a numbered
   list wants. On a phone the same frame would be a few hundred pixels wide
   with a fixed aspect ratio, so mobile opens the demo in its own tab instead.

   Arcade's HTML also carries `webkitallowfullscreen` and `mozallowfullscreen`.
   React drops both, and no browser Mintlify targets still needs them, so only
   `allowFullScreen` is set here.

   `colorScheme: light` is deliberate. The demo is a screen recording of the
   light-mode app, so letting the iframe inherit a dark scheme only repaints
   Arcade's chrome around an image that stays light. */

export const ArcadeDemo = ({ id, title, aspect }) => (
  <div style={{position: "relative", paddingBottom: `calc(${aspect}% + 41px)`, height: 0, width: "100%"}}>
    <iframe
      src={`https://demo.arcade.software/${id}?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true`}
      title={title}
      frameBorder="0"
      loading="lazy"
      allow="clipboard-write; autoplay"
      allowFullScreen
      style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", colorScheme: "light"}}
    />
  </div>
);
