#!/bin/bash
set -Eeuo pipefail

app_host="halma42.localhost"
keycloak_host="auth.halma42.localhost"

project_root=$(dirname "$0")/../..
certs_dir="${project_root}/developer-local-settings/config/certs"

function exit_error {
	local msg="$*"
	echo "ERROR: ${msg}" >&2
	exit 1
}

which mkcert || exit_error "Please install mkcert and run 'mkcert -install' (see: https://github.com/FiloSottile/mkcert)"

if [ ! -d "${certs_dir}" ]; then
	mkdir -p "${certs_dir}"
fi

function generate_keypair {
  local domain="$1"
  local storepass="${2}"
  local cert_file="${certs_dir}/${domain}.pem"
  local key_file="${certs_dir}/${domain}.key"
  local pkcs12_file="${certs_dir}/${domain}.p12"
  local cert_alias="${domain}"

  echo "Generating the keypair for ${domain}. This might take a while..."
  # Also generate for localhost/127.0.0.1/::1 to make Quarkus Dev-UI work properly using https://localhost:8443/q/dev-ui
  mkcert \
  	-cert-file "${cert_file}" \
  	-key-file "${key_file}" \
  	-ecdsa \
  	"${domain}" \
  	localhost \
  	127.0.0.1 \
  	::1

  # This gets mapped to docker containes that do not run as root => lax permissions
  chmod +r "${key_file}"

  echo "Importing into local java truststore: ${pkcs12_file}"
  if [ -f "${pkcs12_file}" ]; then
  	echo "Removing old trusted cert: ${cert_alias}"
  	keytool -delete \
  		-noprompt \
  		-v \
  		-alias "${cert_alias}" \
  		-keystore "${pkcs12_file}" \
  		-storetype PKCS12 \
  		-storepass "${storepass}" \
  		1>/dev/null 2>&1 \
  		|| true
  fi

  echo "Adding new trusted cert: ${cert_alias}"
  keytool -importcert \
      -noprompt \
      -v \
      -trustcacerts \
      -alias "${cert_alias}" \
      -keystore "${pkcs12_file}" \
      -storetype PKCS12 \
      -storepass "${storepass}" \
      -file "${cert_file}"
}

generate_keypair "${app_host}" changeit
generate_keypair "${keycloak_host}" changeit
