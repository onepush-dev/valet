# Valet on Railway: the official upstream image (askvalet/valet, MIT), app unmodified.
# Adds a small start wrapper that keeps config + data on ONE Railway volume (/data), seeds a config with
# local sign-in turned on, and creates the "admin" account from VALET_ADMIN_PASSWORD on first boot.
# Defaults are baked as ENV because Railway templates drop plain variable values.
FROM ghcr.io/askvalet/valet:0.6.1
LABEL org.opencontainers.image.source="https://github.com/onepush-dev/valet"
USER root
RUN apk add --no-cache su-exec
COPY railway/ /opt/railway/
RUN chmod 755 /opt/railway/start.sh
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=8080 \
    VALET_CONFIG=/data/config/config.yaml \
    VALET_DATA=/data/data \
    VALET_ADMIN_USER=admin
EXPOSE 8080
HEALTHCHECK NONE
CMD ["/opt/railway/start.sh"]
