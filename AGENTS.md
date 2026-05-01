# Agent Instructions

## Cursor Cloud specific instructions

- This repository is a dependency-free static HTML/CSS landing page. There is no package manager, install step, build step, linter, or automated test suite configured.
- For local development and manual testing, serve the repository root with `python3 -m http.server 8000 --bind 0.0.0.0` and open `http://localhost:8000`.
- The S3 deployment target used during setup is bucket `samuel-506-hw1` in `us-west-2` (Oregon). Upload `index.html`, `style.css`, and the `images/` folder while preserving object paths.
- The public S3 site should use static website hosting, bucket policy, and public access for `samuel-506-hw1`; after local changes, redeploy the same static file set and verify the exact bucket website endpoint in S3 Properties.
