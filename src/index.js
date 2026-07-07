import { getNearestShops } from "./app.js";

async function main() {
  const position = {
    x: process.argv[2],
    y: process.argv[3],
  };

  try {
    const nearestShopsFromSibiu = await getNearestShops(position);

    nearestShopsFromSibiu.forEach(({ shop, distance }) => {
      console.log(`${shop.name}, ${distance.toFixed(4)}`);
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
