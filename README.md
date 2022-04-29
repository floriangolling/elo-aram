# Elo-Aram (still in progress for better deployment)

A fullstack application to track your stats in LeagueOfLegends' aram mode.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in the /server folder

`LEAGUE_API_KEY`: A permanent league API key

`PORT`          : Server's PORT (ex: 8080)

`DATABASE_HOST` : Database host as string ex: postgresql://postgres_aram....


## Deployment

To deploy this project run

Requirements:

- Docker-compose
- Docker
- Working PostgreSQL Database if you're not using one using docker.

```bash
  docker-compose build && docker-compose up -d
```
