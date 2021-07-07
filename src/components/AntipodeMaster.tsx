import React from "react";
import { Grid, Container, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Search from "./Search";
import axios from "axios";
import { KEY } from "../config";
import AntipodeInfo from "./AntipodeInfo";

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

interface PlaceType {
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

interface Coordinates {
  lat: number;
  long: number;
}

const AntipodeMaster: React.FC = () => {
  const classes = useStyles();

  const [places, setPlaces] = React.useState<PlaceType[] | null>(null);
  const [coord, setCoord] = React.useState<Coordinates[]>([]);

  React.useEffect(() => {
    const config = {
      headers: {
        "content-type": "application/json",
        // "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Credentials": "true",
      },

      // crossorigin: true,
    };
    const fetch = () => {
      // places?.forEach((place) => {
      places &&
        axios
          .get(
            `https://maps.googleapis.com/maps/api/place/details/json?placeid=${
              places[places?.length - 1].place_id
            }&key=${KEY}`,
            config
          )
          .then((res) => {
            setCoord([...coord, res.data.result.geometry.location]);
          })
          .catch((err) => console.log(err));
      // });
    };

    fetch();
  }, [places]);

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
      </Grid>
    </Container>
  );
};

export default AntipodeMaster;
