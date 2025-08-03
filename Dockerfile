FROM node:18 AS builder

#Node user
USER 1000

RUN mkdir /home/node/app
WORKDIR /home/node/app

# explicitly give node user permissions
COPY --chown=node:node package*.json ./

RUN npm install --loglevel=verbose

# explicitly give node user permissions
COPY --chown=node:node . .
RUN npm run build

#non-privliged container
FROM nginxinc/nginx-unprivileged:alpine3.22-perl AS production

COPY --from=builder /home/node/app/build /usr/share/nginx/html

#non-privliged nginx runs on 8080 instead of 80
EXPOSE 8080 

CMD ["nginx", "-g", "daemon off;"]
