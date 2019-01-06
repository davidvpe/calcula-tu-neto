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
    this.getRestOfRows = this.getRestOfRows.bind(this)
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
    if (!isNaN(salary) && salary > 0) {
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

  getRestOfRows() {

    let UIT = 4200
    let essalud = 0.08

    let salary = Number(this.state.salary)
    let anualSalary = salary * 12
    let grati = salary * 2 * (1 + essalud)
    let vacaciones = salary
    let cts = salary
    let descuentoUIT = UIT * 7
    var remuneracionBrutaAnual = anualSalary
    remuneracionBrutaAnual+=grati
    remuneracionBrutaAnual+=vacaciones
    remuneracionBrutaAnual+=cts
    let remuneracionNetaAnual = remuneracionBrutaAnual-descuentoUIT

    var impuestoALaRenta = 0
    var secciones = [0, 5, 20, 35, 45]
    var porcentajes = [8, 14, 17, 20, 30]
    var imposedSections = []

    console.log("total = " + remuneracionNetaAnual)
    for (var i = 0; i < porcentajes.length - 1; i++) {
      var impuesto = 0
      var min = secciones[i] * UIT
      var max = secciones[i + 1] * UIT
      var porcentaje = porcentajes[i] / 100  
      console.log("min = " + min + " max = " + max + " porcentaje = " + porcentaje)
      if (remuneracionNetaAnual > min && remuneracionNetaAnual <= max) {
        impuesto = (remuneracionNetaAnual - min) * porcentaje
        console.log("primer if " + (remuneracionNetaAnual - min) + " = " + (remuneracionNetaAnual - min) * porcentaje)
      } else if (remuneracionNetaAnual > min) {
        impuesto = ((max - min) * porcentaje)
        console.log("segundo if " + (max - min) + " = " + ((max - min) * porcentaje))
      }
      if (impuesto == 0) {
        break
      }
      imposedSections.push({
        percentage: porcentajes[i],
        chargedValue: impuesto
      })
      impuestoALaRenta += impuesto
    }

    let lastLimit = (secciones[secciones.length - 1] * UIT)
    if (remuneracionNetaAnual > lastLimit) {
      let lastPercentage = (porcentajes[porcentajes.length - 1] / 100)
      let lastSection = (remuneracionNetaAnual - lastLimit) * lastPercentage
      impuestoALaRenta += lastSection
    }

    let monthlyTax = (impuestoALaRenta/12)
    let monthlySalary = salary - monthlyTax

    var uiImposedSections = [] 
    for(var i=0 ; i<imposedSections.length ; i++) {
      let taxSection = imposedSections[i]
      let title = "Segmento " + (i+1) + " - " + taxSection.percentage + "%"
      uiImposedSections.push(<RowValue title={title} amount={taxSection.chargedValue} explanation="lalalalalla" />)
    }

    return (
      <List component="nav">
        <RowValue title="Sueldo mensual" amount={salary} explanation="lalalalalla" />
        <RowValue title="Sueldo anual" amount={anualSalary} explanation="lalalalalla" />
        <RowValue title="Gratificaciones" amount={grati} explanation="lalalalalla" />
        <RowValue title="Vacaciones" amount={vacaciones} explanation="lalalalalla" />
        <RowValue title="CTS" amount={cts} explanation="lalalalalla" />
        <RowValue title="Remuneracion Bruta Anual" amount={remuneracionBrutaAnual} explanation="lalalalalla" />
        <RowValue title="Descuento de 7 UITs" amount={descuentoUIT} explanation="lalalalalla" />
        <RowValue title="Remuneracion Neta Anual" amount={remuneracionNetaAnual} explanation="lalalalalla" />
        {uiImposedSections}
        <RowValue title="Impuesto a la renta anual proyectado" amount={impuestoALaRenta} explanation="lalalalalla" />
        <RowValue title="Impuesto a la renta mensual" amount={monthlyTax} explanation="lalalalalla" />
        <RowValue title="Sueldo neto mensual" amount={monthlySalary} explanation="lalalalalla" />
      </List>
    )
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
              {this.getRestOfRows()}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;
