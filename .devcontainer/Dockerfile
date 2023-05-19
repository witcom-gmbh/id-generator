ARG VARIANT=16-buster
FROM mcr.microsoft.com/devcontainers/javascript-node:0-${VARIANT}

ARG INSTALL_NGROK="false"
RUN if [ "${INSTALL_NGROK}" = "true" ]; then su node -c "umask 0002 && mkdir -p /home/node/.local/bin && wget -qO- https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.tgz | tar xvz -C /home/node/.local/bin && chmod +x /home/node/.local/bin/ngrok"; fi

ARG INSTALL_COCOGITTO="true"
ARG COCOGITTO_VERSION="5.3.1"

RUN if [ "${INSTALL_COCOGITTO}" = "true" ]; then \
    su node -c "umask 0002 && mkdir -p /home/node/.local/bin && wget -qO- https://github.com/cocogitto/cocogitto/releases/download/${COCOGITTO_VERSION}/cocogitto-${COCOGITTO_VERSION}-x86_64-unknown-linux-musl.tar.gz | tar xvz -C /home/node/.local/bin && chmod +x /home/node/.local/bin/cog"; \
    fi

ARG INSTALL_YQ="false"
ARG YQ_VERSION="latest"
RUN if [ "${INSTALL_YQ}" = "true" ]; then \
    su node -c "umask 0002 && mkdir -p /home/node/.local/bin && wget -qO/home/node/.local/bin/yq https://github.com/mikefarah/yq/releases/${YQ_VERSION}/download/yq_linux_amd64  && chmod a+x /home/node/.local/bin/yq"; \
    fi

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends moreutils

