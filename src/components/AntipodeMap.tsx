import React, { Component } from "react";
import GoogleMapReact, { Props } from "google-map-react";
import { KEY } from "../config";
import { Coordinates } from "./AntipodeMaster";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

interface MarkerProps {
  lat: number;
  lng: number;
  color: string;
}

const useStyles = makeStyles({
  pin: {
    width: "30px",
    height: "30px",
    borderRadius: "50% 50% 50% 0",
    position: "absolute",
    transform: "rotate(-45deg)",
    left: "50%",
    top: "50%",
    margin: "-20px 0 0 -20px",
    "&::after": {
      content: '""',
      width: "14px",
      height: "14px",
      margin: "8px 0 0 8px",
      background: "#e6e6e6",
      position: "absolute",
      borderRadius: "50%",
    },
  },
});

const Marker: React.FC<MarkerProps> = ({ color }) => {
  const classes = useStyles();

  return <div style={{ background: color }} className={classes.pin}></div>;
};

interface MapProps extends Props {
  coord: Coordinates[];
  antipode?: boolean;
  color: string[];
}

export default class AntipodeMap extends Component<MapProps> {
  static defaultProps = {
    center: {
      lat: 19.0759837,
      lng: 72.8776559,
    },
    zoom: 0,
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "80vh", width: "49%", margin: "16px 0" }}>
        <Typography variant="body1">
          {this.props.antipode ? "Corresponding Antipodes:" : "Entered Places:"}
        </Typography>
        <GoogleMapReact
          bootstrapURLKeys={{ key: `${KEY}` }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          {this.props.coord.map((c, index) => {
            return <Marker key={index} lat={c.lat} lng={c.lng} color={this.props.color[index]} />;
          })}
        </GoogleMapReact>
      </div>
    );
  }
}
