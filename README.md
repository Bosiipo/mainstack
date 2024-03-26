- Build docker image. Replace arguments with appropriate values

  - `DATABASE_URL` : MongoDB database URL
  - `USERNAME` : Username to login with on the API
  - `PASSWORD` : Password to login with on the API
  - `SECRET` : Secret to use to sign JWT token

  ```
  docker build --build-arg DATABASE_URL="" --build-arg USERNAME="" --build-arg PASSWORD="" --build-arg SECRET="" --tag test:latest  .
  ```

- Run built image

  `docker run -d -p 7070:7070 test:latest`

The API should be up and running on `localhost:7070/v1`
