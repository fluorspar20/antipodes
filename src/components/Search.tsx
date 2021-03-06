import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { FormControl } from "@material-ui/core";
import _ from "lodash";
import parse from "autosuggest-highlight/parse";
import { Grid, Theme } from "@material-ui/core";

import { PlaceType } from "./AntipodeMaster";
import { KEY } from "../config";
import axios from "axios";

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  search: {
    width: "100% !important" as any,
  },
  submit: {
    height: theme.spacing(7),
    marginLeft: theme.spacing(2),
  },
}));

interface LocationSearchProps {
  places: PlaceType[] | null;
  setPlaces: React.Dispatch<React.SetStateAction<PlaceType[] | null>>;
}

interface SearchProps extends LocationSearchProps {}

const LocationSearch: React.FC<LocationSearchProps> = ({ places, setPlaces }) => {
  const classes = useStyles();
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<PlaceType[]>([]);

  React.useEffect(() => {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    const fetch = () => {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${inputValue}&types=geocode&language=en&key=${KEY}`,
          config
        )
        .then((res) => {
          setOptions(res.data.predictions);
        })
        .catch((err) => console.log(err));
      // });
    };

    fetch();
  }, [places, inputValue]);

  const handleInputChange = (event: React.ChangeEvent<{}>, newInputValue: string) => {
    setInputValue(newInputValue);
  };

  return (
    <Autocomplete
      fullWidth
      multiple
      className={classes.search}
      id="places-autocomplete"
      limitTags={2}
      style={{ width: 300 }}
      getOptionLabel={(option) => (typeof option === "string" ? option : option.description)}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={places ? places : undefined}
      onChange={(event: any, newValue: PlaceType[] | null) => {
        setOptions(newValue ? options.concat(newValue) : options);
        setPlaces(newValue);
      }}
      onInputChange={_.debounce(handleInputChange, 500)}
      renderInput={(params) => (
        <TextField {...params} label="Enter a country or city" variant="outlined" fullWidth />
      )}
      renderOption={(option) => {
        const matches = option.structured_formatting.main_text_matched_substrings;
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match: any) => [match.offset, match.offset + match.length])
        );

        return (
          <Grid container alignItems="center">
            <Grid item>
              <LocationOnIcon className={classes.icon} />
            </Grid>
            <Grid item xs>
              {parts.map((part, index) => (
                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                  {part.text}
                </span>
              ))}
              <Typography variant="body2" color="textSecondary">
                {option.structured_formatting.secondary_text}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
};

const Search: React.FC<SearchProps> = ({ places, setPlaces }) => {
  return (
    <>
      <Typography variant="h6">Find out the opposite side of the world from: </Typography>
      <Grid alignItems="center" container>
        <Grid item lg={8} xs={12}>
          <FormControl fullWidth variant="outlined">
            <LocationSearch places={places} setPlaces={setPlaces} />
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
};

export default Search;
