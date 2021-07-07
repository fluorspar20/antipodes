import React from "react";
import { Grid, Container, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import Search from "./Search";

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

const AntipodeMaster: React.FC = () => {
  const classes = useStyles();

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
          <Grid container>
            <Typography variant="h4">
              <InfoOutlinedIcon fontSize="default" color="action" /> What is an antipode?
            </Typography>
            <Typography variant="body1">
              An <strong>antipode</strong>, or antipodal point, is the point on the planet that is
              located diametrically opposite to a specific geographic location, and therefore, is
              the farthest point in the world from that location. The antipode of any place can be
              identified by drawing an imaginary straight line that passes through the center of the
              planet and reaches the other side of the world.
            </Typography>
            <Typography variant="body1">
              Since most of the planet is covered by water (71%), the antipodal point to most cities
              is located in the ocean. However, there are many cities around the world that are
              antipodes of each other.
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Search />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AntipodeMaster;
