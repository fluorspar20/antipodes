import React from "react";
import { Grid, Container, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import axios from "axios";

import Search from "./Search";
import { KEY } from "../config";
import { getAntipode } from "../utils/getAntipode";
import { getRandomColor } from "../utils/getRandomColor";
import AntipodeInfo from "./AntipodeInfo";
import AntipodeMap from "./AntipodeMap";

const useStyles = makeStyles(({ spacing }: Theme) => ({
  header: {
    width: "100%",
    margin: spacing(4, 0, 0, 0),
    textAlign: "center",
    fontSize: spacing(6),
    fontWeight: 500,
  },
  search: {
    minWidth: "50%",
    marginRight: spacing(1),
  },
  submit: {
    height: spacing(7),
  },
}));

// interface for places provided by Places API
export interface PlaceType {
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings: [
      {
        offset: number;
        length: number;
      }
    ];
  };
  place_id: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

const AntipodeMaster: React.FC = () => {
  const classes = useStyles();

  // state to maintain the places selected by the user
  const [places, setPlaces] = React.useState<PlaceType[] | null>([]);

  // state to maintain the coordinates of places selected by the user
  const [coord, setCoord] = React.useState<Coordinates[]>([]);

  // state to maintain the antipode coordinates of places selected by the user
  const [antipodeCoord, setAntipodeCoord] = React.useState<Coordinates[]>([]);

  // state to maintain the colors of markers for each antipode pair
  const [colors, setColors] = React.useState<string[]>([]);

  React.useEffect(() => {
    const config = {
      headers: {
        "content-type": "application/json",
        // "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Credentials": "true",
      },

      // crossorigin: true,
    };

    setCoord([]);

    const fetch = () => {
      places?.length &&
        places?.forEach((place) => {
          axios
            .get(
              `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place.place_id}&key=${KEY}`,
              config
            )
            .then((res) => {
              setCoord((c) => [...c, res.data.result.geometry.location]);
            })
            .catch((err) => console.log(err));
        });
    };

    fetch();
  }, [places]);

  React.useEffect(() => {
    setAntipodeCoord(getAntipode(coord));
    setColors(getRandomColor(coord.length));
  }, [coord]);

  return (
    <Container maxWidth="md">
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Grid container>
            <Typography className={classes.header} variant="h1">
              Antipode Finder
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <AntipodeInfo />
        </Grid>
        <Grid item xs={12}>
          <Search places={places} setPlaces={setPlaces} />
        </Grid>
        <Grid item xs={12}>
          <Grid justify="space-between" container>
            <Typography variant="subtitle1">
              <em>
                Note: Two locations having the same marker color implies that they are antipodes of
                each other
              </em>
            </Typography>
            <AntipodeMap coord={coord} color={colors} />
            <AntipodeMap antipode coord={antipodeCoord} color={colors} />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AntipodeMaster;
