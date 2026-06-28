<script lang="ts">
  interface Props {
    alt: string;
    caption: string;
    src: string;
    title: string;
    version?: string;
    wide?: boolean;
  }

  const {
    alt,
    caption,
    src,
    title,
    version = "0.1.0",
    wide = false,
  }: Props = $props();
  const href = $derived(`${src}?v=${version}`);
</script>

<figure class="flow-chart" class:wide>
  <img {alt} decoding="async" loading="lazy" src={href} />
  <figcaption><strong>{title}</strong> - {caption}</figcaption>
</figure>
