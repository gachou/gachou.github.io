---
layout: default.html
titlepage: true
---

# What is **画帖** (gacho<span class="suffix-u">u</span>)?

Gachou will be a NodeJS-based photo and video management tool. This repository describes the 
attempted design and architecture.

The name derives from the Japanese word **画帖** for "picture album"

# Use-cases

* Upload images from a computer, cell-phone or import them directly from the cameras SD-card
* Evaluate and select images from an import-stream. Select the best version of similar images
* Add metadata (hierarchical tags, descriptions) to images
* Search images based on tags and descriptions
* Multiuser-support (run in a local network)
* Replicate selected images to a public or semi-public instance or warau running. 

# Components

* Import-tool (bulk import of videos and photos from camera SD-card)
* Mobile app to synchronize smartphone-galleries with warau (low-prio)
* Rest-service to store, enrich and search images and videos
* [Media-Converter](media-converter/): Conversion- and Scale-workers for scaling photos and videos to thumbnail sizes and formats.
* Crawler for initial bulk-import of photos on a hard disc
* HTML5-frontend to access Rest-Service and display a search UI

