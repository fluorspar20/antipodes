import React from "react";
import { Grid, Container, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Search from "./Search";
import axios from "axios";
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

  const [places, setPlaces] = React.useState<PlaceType[] | null>([]);
  const [coord, setCoord] = React.useState<Coordinates[]>([]);
  const [antipodeCoord, setAntipodeCoord] = React.useState<Coordinates[]>([]);
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

  const handleClick = () => {
    console.log(places);

    // snippet to make sure that if user presses find a multiple times, duplicate entries are not taken into account
    // const uniqueCoords: Coordinates[] = [];
    // coord.forEach((c: any) => {
    //   if (!uniqueCoords.includes(c)) {
    //     uniqueCoords.push(c);
    //   }
    // });

    // setCoord(uniqueCoords);
    console.log(coord);
  };

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
          <Search places={places} setPlaces={setPlaces} handleClick={handleClick} />
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
