# GlobeHub

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

Make sure when running build that `NODE_ENV` is set to `production` in the `.env`. This is to make sure that the build is optimized for production.

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

To run a local version of the database, use a local storage bucket or run a dockerized build of the app you need to have Docker installed on your machine. You can download it [here](https://www.docker.com/products/docker-desktop). This is useful for testing the app in a production-like environment, and to get data from the database to use in the app.

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

To delete the data in the database you can run the following command:

```bash
bun run db:reset
```

For accesing the logs of the database you can run the following command:

```bash
bun run db:logs
```

### Local storage bucket

When you have Docker installed you can run the following command to start the storage bucket:

```bash
bun run bucket:start
```

To stop the storage bucket:

```bash
bun run bucket:stop
```

For accesing the logs of the storage bucket:

```bash
bun run bucket:logs
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

To start all the services at once (database, storage bucket and app) you can run:

```bash
bun run docker:start
```

To put all the services down you can run:

```bash
bun run docker:down
```

This will stop all the services and remove the containers. To avoid removing the containers you must stop them individually.

When developing the most useful setup is to run the database and the storage bucket locally and run the app development server with `bun dev`. This is because the app development server has hot reload and is faster than the dockerized build. The dockerized build is useful for testing the app in a production-like environment or for deploying the app.

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
- Use `type` instead of `interface` for typescript types. This is to keep the code consistent and to make it easier to read. Aldso `type` is more flexible than `interface` since it can be used for unions and intersections.

## Scrum

- For the product backlog we are using GitLab issues to represent each task. We are also labeling each issue with a point label which represents the amount of work that needs to be done for the task. We also use other labels to represent the type of task it is, for example `bug`, `feature`, `chore` etc.
- We are using issue boards to represent each sprint. We are using the `Open` column to represent the backlog and the `Closed` column to represent the tasks that are done. We are also using the `In Progress` column to represent the tasks that are currently being worked on.
- The user stories are represented as milestones in GitLab. Each milestone represents a user story and the tasks that are required to complete the user story are represented as issues in the milestone.
- Other than that we are reviewing each others pull requests and making sure that the code is up to standard.
