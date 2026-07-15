#!/bin/bash
# Downloads real, license-free Unsplash spa/wellness photography to use as
# placeholders until real client photography is available. Re-run any time.
# Portrait crops (3:4) go to service cards; wide crops (16:9) to hero/misc.
set -e
cd "$(dirname "$0")/.."

declare -A WIDE=(
  [public/assets/images/hero/hero-bg.jpg]="photo-1544161515-4ab6ce6db874"
  [public/assets/images/about/about-hero.jpg]="photo-1540555700478-4be289fbecef"
  [public/assets/images/misc/final-cta-bg.jpg]="photo-1519823551278-64ac92734fb1"
  [public/assets/images/services/services-hero.jpg]="photo-1600334129128-685c5582fd35"
  [public/assets/images/packages/packages-hero.jpg]="photo-1720118509152-2df877673bee"
  [public/assets/images/news/news-hero.jpg]="photo-1507652313519-d4e9174996dd"
  [public/assets/images/misc/learn-hero.jpg]="photo-1761470575018-135c213340eb"
  [public/assets/images/misc/contact-hero.jpg]="photo-1763873993447-1d0be71a96d9"
)

# Service images verified by eye to match their subject (cavitation device,
# facial treatment, scale, syringe, smile, vial, botox injection, smoke).
declare -A PORTRAIT=(
  [public/assets/images/services/t-shape-2.jpg]="photo-1761819922058-d15028ed9817"
  [public/assets/images/services/face-contouring.jpg]="photo-1643684391140-c5056cfd3436"
  [public/assets/images/services/glp3-weight-loss.jpg]="photo-1522844990619-4951c40f7eda"
  [public/assets/images/services/glutathione.jpg]="photo-1746017090180-ebb14a589639"
  [public/assets/images/services/teeth-whitening.jpg]="photo-1654373535457-383a0a4d00f9"
  [public/assets/images/services/peptides.jpg]="photo-1579165466741-7f35e4755660"
  [public/assets/images/services/botox.jpg]="photo-1746708810803-722593e53772"
  # NOTE: about/founder.jpg is Cheryl's REAL photo (client-supplied) - deliberately
  # not listed here so re-running this script never overwrites it with stock.
  [public/assets/images/about/meaning.jpg]="photo-1613750255797-7d4f877615df"
  [public/assets/images/misc/consult.jpg]="photo-1573497620053-ea5300f94f21"
)

for path in "${!WIDE[@]}"; do
  id="${WIDE[$path]}"
  mkdir -p "$(dirname "$path")"
  curl -sL "https://images.unsplash.com/${id}?w=1600&h=900&fit=crop&q=80&fm=jpg" -o "$path"
  echo "wide  $path <- $id"
done

for path in "${!PORTRAIT[@]}"; do
  id="${PORTRAIT[$path]}"
  mkdir -p "$(dirname "$path")"
  curl -sL "https://images.unsplash.com/${id}?w=900&h=1200&fit=crop&q=80&fm=jpg" -o "$path"
  echo "port  $path <- $id"
done

echo "Done."
