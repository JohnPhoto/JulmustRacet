import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import { LogIn, UserEdit } from "../routes";
import Link from "next/link";
import { signin } from "next-auth/client";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import useOfflineSession from "../db/useOfflineSession";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  profileButtonSpan: {
    textTransform: "none",
  },
}));

const LoggedIn = ({ user }) => {
  const classes = useStyles();
  return (
    <Link {...UserEdit} passHref>
      <Button
        color="inherit"
        endIcon={
          <Avatar
            className={classes.avatar}
            src={user.image}
            alt={user.username || user.email}
          >
            {(user.username || user.email).substring(0, 1)}
          </Avatar>
        }
      >
        <Typography noWrap className={classes.profileButtonSpan}>
          {user.username || user.email}
        </Typography>
      </Button>
    </Link>
  );
};

const LoggedOut = () => {
  const onSignInClick = (e) => {
    e.preventDefault();
    signin();
  };

  return (
    <Link {...LogIn} passHref>
      <Button color="inherit">
        <FormattedMessage defaultMessage="Logga in" />
      </Button>
    </Link>
  );
};

const Loading = () => {
  return <Fragment />;
};

export default function ProfileArea() {
  const [session, loading] = useOfflineSession();
  if (loading) {
    return <></>;
  }
  return <>{session ? <LoggedIn user={session.user} /> : <LoggedOut />}</>;
}
