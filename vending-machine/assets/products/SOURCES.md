# Current asset integration

The user supplied `gatorade.png`, `powerade.png`, `electrolit.png`,
`bodyarmor.png`, and `propel.png` on November 11, 2026. These files are now
bundled with literal static requires in `App.tsx` and rendered by the shared
product display in catalog, checkout, and confirmation using contain scaling.
No image files were downloaded, generated, or modified during integration.
The supplied files do not include additional source/license evidence; the
investigation below is retained as historical context, not as provenance for
these supplied PNGs.

---

# Product photo sourcing — incomplete

Reviewed November 11, 2026. No product photographs have been downloaded or bundled:
permission to redistribute appropriate photos in this application could not be
established. Public access to a product page does not itself establish reuse
permission. No generated substitutes, remote image URLs, or missing-file
`require()` calls were introduced.

| Brand | Sources investigated | Result |
| --- | --- | --- |
| Gatorade | https://www.gatorade.com/ ; https://www.gatorade.com/terms | No redistribution permission established; attempted terms URL was inaccessible to the research tool. |
| Powerade | https://www.powerade.com/ ; https://www.coca-cola.com/us/en/legal/terms-of-service | Official site has product photos. Terms restrict copying, downloading and redistribution except as authorized; no applicable asset license established. |
| Electrolit | https://electrolit.com/pages/terms-of-service | Attempted terms URL was inaccessible to the research tool; no permission established. |
| BODYARMOR | https://www.drinkbodyarmor.com/ ; https://www.drinkbodyarmor.com/legal/ ; https://www.drinkbodyarmor.com/press | Product imagery exists; legal URL was inaccessible to the research tool and no applicable photo redistribution license was established. |
| Propel | https://www.propelwater.com/ ; https://contact.pepsico.com/propel/terms-conditions | Product imagery exists; retrieved terms page did not expose a photo reuse grant. |

Wikimedia Commons searches did not establish suitable licensed bottle photos for
all five brands. This is a record of this investigation, not a claim that licensed
photos do not exist.

The five hydration products use explicit “Photo unavailable” text consistently in
the catalog, checkout and receipt. The existing six fictional drinks retain their
original native artwork. Prices, stock and descriptions for the five brands come
from the existing `data/products.ts`. Unspecified flavor, nutrition and bottle size
are not invented.

To finish: obtain appropriately licensed photos (including permission evidence,
author, license and attribution requirements), save the actual PNG/JPEG files here,
and add literal static paths such as `require('./assets/products/gatorade.png')`
in a shared image mapping. Render through the shared `DrinkCan` presentation
component with `resizeMode="contain"`, bounded dimensions, loading/error feedback,
and verify every screen in Expo offline. Do not add requires until the corresponding
files exist. Record exact source URLs and license evidence here for each file.
