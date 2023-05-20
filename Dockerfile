FROM node:16-alpine

RUN adduser --system --uid 1001 app

# Create deployment directory
RUN mkdir -p /app

WORKDIR /app

RUN cp -r /drone/src/dist/* /app/

RUN chown -R 1001:0 /app \  
    && chmod -R g+=wrx /app

USER app

EXPOSE 3000

CMD node ./server.js
