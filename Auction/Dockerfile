# Build stage
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/Auction-0.0.1-SNAPSHOT.jar app.jar

# HuggingFace Spaces requires port 7860
EXPOSE 7860

ENTRYPOINT ["java", "-jar", "-Dserver.port=7860", "app.jar"]
