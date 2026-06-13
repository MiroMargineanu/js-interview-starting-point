# Coffee Shop Finder

A CLI program that takes a user's coordinates and returns the three closest coffee shops, ordered from nearest to farthest.

## Problem

Given a user's position on a flat plane (x and y coordinates), fetch all available coffee shops from a remote API and find the three that are closest to the user using Euclidean distance.

## Usage

```
yarn start <x> <y>
```

**Example:**

```
yarn start 47.6 -122.4
```

**Example output:**

```
Blue Bottle Seattle2, 0.0645
Blue Bottle Seattle, 0.0861
Blue Bottle SF, 10.0793
```

Distances are rounded to four decimal places.

## How it works

1. Fetches an access token from the API (`POST /v1/tokens`)
2. Fetches the full list of coffee shops using that token (`GET /v1/coffee_shops`)
3. Calculates the Euclidean distance between the user and each shop: `sqrt((shopX - userX)² + (shopY - userY)²)`
4. Sorts shops by distance ascending and returns the top three

The API may occasionally return errors (503, 504). The program handles these gracefully and exits with a descriptive message.

## Commands

```
yarn start <x> <y>   # Find the three nearest coffee shops
yarn test            # Run the test suite
yarn dev             # Start in development/watch mode
```
