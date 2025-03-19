## Getting started
1. Add hostname entry to `/etc/hosts` (windows: `c:\Windows\System32\drivers\etc\hosts`) in the form: \
   `127.0.0.1 halma42.localhost`
2. Generate a new keypair for HTTPS communication: `scripts/certs/generate-keypair.sh`
3. **Import certificate** to the correct Java (Adapt accordingly for Windows): 
   ```
   cd /Users/yanicdobler/IT-Dobler/Halma/developer-local-settings/config
   sudo /Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home/bin/keytool -importcert -file certs/halma42.localhost.pem -cacerts -keypass changeit -storepass changeit -noprompt -alias halma42-local
   ```
4. Copy `developer-local-settings-template` to `developer-local-settings` and adjust secrets/config (do not overwrite the generated certs)