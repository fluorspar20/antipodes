import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import { Grid, Theme } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { KEY } from "../config";

import { FormControl } from "@material-ui/core";

function loadScript(src: string, position: HTMLElement | null, id: string) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

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
}

interface LocationSearchProps {
  places: PlaceType[] | null;
  setPlaces: React.Dispatch<React.SetStateAction<PlaceType[] | null>>;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ places, setPlaces }) => {
  const classes = useStyles();
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<PlaceType[]>([]);
  const loaded = React.useRef(false);

  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${KEY}&libraries=places`,
        document.querySelector("head"),
        "places-api"
      );
    }

    loaded.current = true;
  }

  const fetch = React.useMemo(
    () =>
      throttle((request: { input: string }, callback: (results?: PlaceType[]) => void) => {
        (autocompleteService.current as any).getPlacePredictions(request, callback);
      }, 200),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && (window as any).google) {
      autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(places ? places : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results?: PlaceType[]) => {
      if (active) {
        let newOptions = [] as PlaceType[];

        if (places) {
          newOptions = places;
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [places, inputValue, fetch]);

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
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
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

export default function Search() {
  const classes = useStyles();
  const [places, setPlaces] = React.useState<PlaceType[] | null>(null);

  const handleClick = () => {
    console.log(places);
  };

  return (
    <>
      <Typography variant="h6">Find out the opposite side of the world from: </Typography>
      <Grid alignItems="center" container>
        <Grid item lg={8} xs={12}>
          <FormControl fullWidth variant="outlined">
            <LocationSearch places={places} setPlaces={setPlaces} />
          </FormControl>
        </Grid>
        <Grid item>
          <Button
            onClick={() => handleClick()}
            className={classes.submit}
            variant="contained"
            color="primary"
          >
            <SearchOutlinedIcon /> Find
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
