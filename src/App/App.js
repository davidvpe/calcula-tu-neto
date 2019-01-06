import React, { Component } from 'react';
import './App.css';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';

class RowValue extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    return (
      <div>
      <ListItem onClick={this.handleOpen}>
        <ListItemText primary={this.props.title} />
        <ListItemText primary={this.props.amount} />
      </ListItem>
      <Dialog
      onClose={this.handleClose}
      aria-labelledby="customized-dialog-title"
      open={this.state.open}
    >
    <MuiDialogTitle id="customized-dialog-title">
        {this.props.label}
      </MuiDialogTitle>
      <MuiDialogContent>
        <Typography gutterBottom>
          {this.props.explanation}
        </Typography>
      </MuiDialogContent>
      <MuiDialogActions>
        <Button onClick={this.handleClose} color="primary">
          Ok
        </Button>
      </MuiDialogActions>
    </Dialog>
    </div>
    )
  }
}

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      salary: 0,
      inputError: false
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    const salary = e.target.value
    console.log(salary)
    if (salary.length === 0) {
      this.setState({
        inputError: false
      })
      return
    }
    if(!isNaN(salary) && salary > 0) {
      this.setState({
        salary: salary,
        inputError: false
      })
    } else {
      this.setState({
        inputError: true
      })
    }
  }

  render() {
    return (
      <div className="App">
        <Grid container>
          <Grid item xs={12}>
            <header>
              <h2>Calcula tu neto!</h2>
            </header>
            <TextField
              error={this.state.inputError}
              id="salary"
              label="Sueldo mensual"
              onChange={this.handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">S/.</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <List component="nav">
              <RowValue title="Impuesto a la renta" amount="1000" explanation="lalalalalla" />
            </List>

          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;
