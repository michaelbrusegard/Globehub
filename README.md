# Globehub

## Table of Contents

- [Requirements](#requirements)
  - [Extra requirements (arrived later)](#extra-requirements-arrived-later)
- [Documentation](#documentation)
- [Screenshots](#screenshots)
- [What I Have Learned](#what-i-have-learned)
- [Development Setup](#development-setup)
  - [Build](#build)
- [Docker](#docker)
  - [Local Database Setup](#local-database-setup)
  - [Local Storage](#local-storage)
  - [Dockerized Build](#dockerized-build)
- [Check Linting and Formatting](#check-linting-and-formatting)
- [Commit Messages](#commit-messages)
- [Code Quality](#code-quality)
- [Scrum](#scrum)

## Requirements

- [x] Admin should be able to add travel destinations to the service so that more travel destinations can be shared with the users of the service
- [x] All who come to the service should get a nice and clear page of travel destinations
- [x] Users should be able to have their own user profile
- [x] Dark mode should be offered to users who prefer this
- [ ] If this becomes a commercial product, the service will offer space on the website for advertising
- [x] Logged in users can leave a review of travel destinations. In this connection, it must also be possible to see an overview of reviews one has made and change these afterwards if one wishes
- [x] Logged in users should be able to filter travel destinations so that they only see travel destinations that suit the user's preferences
- [x] Logged in users should be able to see more detailed information about a travel destination
- [x] Logged in users should have the opportunity to mark travel destinations they have been to

### Extra requirements (arrived later)

- [x] The weather at the travel destination now, so that users have some idea of temperature
- [x] Users can add travel destination, and admin can delete unwanted destinations
- [ ] Recommended for you, get a destination recommended based on your preferences through your interactions on the page (add favorite continent, things you have liked/favorites/commented)
- [x] Admin should be able to delete and edit travel destinations (all fields)

## Screenshots

<img width="1656" alt="Screenshot 2024-10-04 at 05 40 20-min" src="https://github.com/user-attachments/assets/aea9a473-cb49-4d6f-b044-1f5fc739ad50">
<img width="1656" alt="Screenshot 2024-10-04 at 05 35 15-min" src="https://github.com/user-attachments/assets/a1cb9ec0-29a6-40c5-9676-c8f6e8a0fe38">
<img width="1656" alt="Screenshot 2024-10-04 at 05 34 45-min" src="https://github.com/user-attachments/assets/cc3f8fe7-c03f-43f0-a433-c8079c00ec24">
<img width="1656" alt="Screenshot 2024-10-04 at 05 34 36-min" src="https://github.com/user-attachments/assets/bce4ef68-930e-49d0-9bcf-85ebb8ac4af2">
<img width="1656" alt="Screenshot 2024-10-04 at 05 34 12-min" src="https://github.com/user-attachments/assets/52df8d0c-1dee-49e1-8433-967a0607b966">
<img width="1656" alt="Screenshot 2024-10-04 at 05 33 49-min" src="https://github.com/user-attachments/assets/74c426e0-ca2a-43aa-b814-e7582e8f2ac3">
![Tokyo  Globehub-min](https://github.com/user-attachments/assets/b7788153-dfc6-486b-9e25-cf8180d63be9)

## What I Have Learned

1. **Sometimes what is best for the project is not the best for the developer**.

- Now I always wanted to use the best technologies for the product I am building, which is why we used Next.js, a Postgres database and s3 storage in Docker containers. But as the only experienced developer in the team, it was a bad decision to choose more intricate technologies when we could have just used Firebase. In the end, I feel like I learned a lot from this project, but because of these choices, I had to do almost all the work myself. Choosing a more complex stack was not beneficial for the grade either, but it was a good learning experience. Also scaling using Docker and a self-hosted database is much easier than using Firebase and way more realistic for a professional project.

2. **You can't force someone to learn**.

- To help teach the rest of the team, we had workshops and meetings where I tried to explain React and Next.js concepts to the team. I also showed how to implement a feature. But in the end, even with how much praise the team gave for these workshops it did not feel like it helped much. It does not really matter how many times I would explain and go through a concept if nobody was motivated enough to sit down and learn it alone. I think that most learning comes from reading documentation and trying and failing. I think this was very frustrating for everyone. Looking back I fee like this was caused by an issue in the course itself. Learning Scrum should not be done at the same time as learning web development.

3. **We should have used an ORM**.

- Now to somewhat ease the use of the database, I thought it was a good idea to omit the use of an ORM. The reason for this was to avoid yet another dependency the team had to learn. Also most team members had the database course at the same time so writing raw SQL would not be a problem I thought. However, I think this was not the best decision. Writing raw SQL can be hard since you do not get any help from the IDE in form of autocompletion and syntax highlighting and types. It is also hard to debug since you have to manually check the SQL statement and the result. Also I think I overestimated the skill level of the team when it comes to SQL.

4. **Mutations and Queries should have been placed in separate files**.

- Now to save time, instead of setting up an API layer we utilized the React 19 Server Components and Server Actions that Next.js provides. Now there is nothing inherently wrong with this approach, except maybe if you needed to use the same API for another app. But the way we did it was writing all the backend code directly in the server components and server actions where they were used. This lead to difficult to navigate code and repeated code in some places. Instead this should have been moved into its own folder with multiple files and functions for each query and mutation.

## Documentation

Here is a list of documentation to get started:

- [React](https://react.dev/reference/react) - Library for building user interfaces
- [Next.js](https://nextjs.org/docs) - Framework for routing and server-side rendering
- [Next-intl](https://next-intl-docs.vercel.app/) - Internationalization library
- [Auth.js](https://authjs.dev/getting-started/introduction) - Authentication library
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling library
- [Next-themes](https://github.com/pacocoursey/next-themes) - Dark mode
- [NextUI](https://nextui.org/docs/guide/introduction) - Reusable UI components
- [Postgres.js](https://github.com/porsager/postgres) - This is a PostgreSQL client used to interact with the database using SQL.
- [OpenWeatherMap](https://openweathermap.org/current) - Current Weather API used to get the current weather for a location.

### Other resources

- [Mozilla](https://developer.mozilla.org/en-US/) - Great resource for looking up documentation for web technologies
- [Can I use](https://caniuse.com/) - Check browser support for different web technologies (especially useful for CSS)
- [Material Symbols](https://fonts.google.com/icons) - Icon library we are using

## Development setup

Make sure you have Bun installed on your machine. If you don't have it, you can download it [here](https://bun.sh/docs/installation).

If you can't install Bun, you can always use [Node.js](https://nodejs.org/en/) with the `npm` command instead, but it will not be as fast as Bun.

First, install dependencies:

```bash
bun install
```

Then you need to copy the `.env.example` file and rename the copy to `.env`. This file contains the environment variables that are used in the project. You can find the values for the dev environment in the `#env` channel on Discord.

Lastly, run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

When you build the project, you prerender all the Server Side Generated (SSG) pages. This makes the site load faster and perform better and behave like it will when it is deployed. When serving the built project it will not hot reload when you make changes to the code like it does in development mode.

You can build the project with the following command:

```bash
bun run build
```

Then to serve the build locally, run:

```bash
bun run start
```

## Docker

To run a local version of the database, use the local storage or run a dockerized build of the app you need to have Docker installed on your machine. You can download it [here](https://www.docker.com/products/docker-desktop). This is useful for testing the app in a production-like environment, and to get data from the database to use in the app.

### Local database setup

When you have Docker installed you can run the following command to start the database:

```bash
bun run db:start
```

To stop the database you can run the following command:

```bash
bun run db:stop
```

To seed the database (fill it with test data) you can run the following command:

```bash
bun run db:seed
```

To delete the data in the database so you can reseed it you can run the following command:

```bash
bun run db:reset
```

For accesing the logs of the database you can run the following command:

```bash
bun run db:logs
```

For toggling the role of your user with the specified email between admin and user you can run the following command:

```bash
bun run db:admin YOUR_USER_EMAIL
```

### Local storage

When you have Docker installed you can run the following command to start the S3 storage:

```bash
bun run s3:start
```

To stop the storage:

```bash
bun run s3:stop
```

For accesing the logs of the storage:

```bash
bun run s3:logs
```

### Dockerized build

To build and run the app in a docker container you can run the following command:

```bash
bun run app:start
```

To stop the app you can run the following command:

```bash
bun run app:stop
```

For accesing the logs of the app:

```bash
bun run app:logs
```

To start all the services at once (database, storage and app) you can run:

```bash
bun run docker:start
```

To put all the services down you can run:

```bash
bun run docker:down
```

This will stop all the services and remove the containers. To avoid removing the containers you must stop them individually.

When developing the most useful setup is to run the database and the storage locally and run the app development server with `bun dev`. This is because the app development server has hot reload and is faster than the dockerized build. The dockerized build is useful for testing the app in a production-like environment or for deploying the app.

## Check linting and formatting

To check linting and formatting you run the respective command:

```bash
bun lint
```

If you are using vscode and are experiencing issues with types, you can restart the typescript server by pressing `cmd + shift + p` and then type `TypeScript: Restart TS Server` (You need to have a typescript file open for this to work).

You can also try restarting the whole editor by pressing `cmd + shift + p` and then type `Developer: Reload Window`.

On windows you can use `ctrl` instead of `cmd`.

## Commit messages

We are using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for our commit messages. This is to ensure that we have a consistent way of writing commit messages to make it easier to understand what has been changed and why. Try to follow the guidelines as closely as possible. You can also use [the recommended vscode extension](.vscode/extensions.json) to help you write the commit messages.

## Code quality

- To keep the code as consistent as possible use functions for react components or hooks instead of const variables with arrow function syntax. An exception is when using the forwardRef hook or when creating compound components.
- Only use default export for pages or layouts etc. since it is required by Next.js. For everything else use named exports. This is to make it easier to find the components in the codebase or change them without ending up with different names for the same component.
- Use `type` instead of `interface` for typescript types. This is to keep the code consistent and to make it easier to read. Also `type` is more flexible than `interface` since it can be used for unions and intersections.

## Scrum

- For the product backlog we are using GitLab issues to represent each task. We are also labeling each issue with a point label which represents the amount of work that needs to be done for the task. We also use other labels to represent the type of task it is, for example `bug`, `feature`, `chore` etc.
- We are using issue boards to represent each sprint. We are using the `Open` column to represent the backlog and the `Closed` column to represent the tasks that are done. We are also using the `In Progress` column to represent the tasks that are currently being worked on.
- The user stories are represented as milestones in GitLab. Each milestone represents a user story and the tasks that are required to complete the user story are represented as issues in the milestone.
- Other than that we are reviewing each others pull requests and making sure that the code is up to standard.
