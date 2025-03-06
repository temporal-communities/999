# »999 und noch etliche [mehr]«: Web app for Georg Nikolaus Bärmann’s _Würfelalmanach_ from 1829

The Würfelalmanach, published by Georg Nikolaus Bärmann in 1829, is a playful system for generating one-act plays by rolling dice. These short dramas were popular on stage and in private gatherings, and Bärmann's book offered a way to create 4×10^155 possible variations from 1,200 text fragments.
This web app recreates the experience, letting you explore an early example of algorithmic storytelling in an interactive way.

## Usage

This project requires [Node.js](https://nodejs.org/en) (LTS v20 at time of writing).
Please follow the installation instructions for your platform.

Install the dependencies:

```bash
npm install
```

To start the development server:

```bash
npm run dev
```

To create a production build:

```bash
npm run build
```

## Source text

The text and dice table was digitised and added to [Wikisource](https://de.wikisource.org/wiki/Neunhundert_neun_und_neunzig_und_noch_etliche_Almanachs-Lustspiele_durch_den_W%C3%BCrfel).
A [TEI version](src/lib/assets/neunhundert-neun-und-neunzig-und-noch-etliche-almanachs-lustspiele.xml) of the text and a [JSON dice chart](https://github.com/temporal-communities/999/blob/main/src/lib/assets/dice_chart.json) were created for this project.

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---

Funded by the Deutsche Forschungsgemeinschaft (DFG, German Research Foundation) under Germany’s Excellence Strategy in the context of the Cluster of Excellence Temporal Communities: Doing Literature in a Global Perspective – EXC 2020 – Project ID 390608380.
