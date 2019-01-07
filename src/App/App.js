import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';
import './App.css';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/InfoOutlined'

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
      <TableRow>
        <TableCell component="th" scope="row">
          {this.props.title}
          <IconButton aria-label="Info">
            <InfoIcon></InfoIcon>
          </IconButton>
        </TableCell>
        <TableCell align="right">
          {this.props.amount}
        </TableCell>
        <Dialog
          onClose={this.handleClose}
          aria-labelledby="customized-dialog-title"
          open={this.state.open}>
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
      </TableRow>
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
    remuneracionBrutaAnual += grati
    remuneracionBrutaAnual += vacaciones
    remuneracionBrutaAnual += cts
    let remuneracionNetaAnual = remuneracionBrutaAnual - descuentoUIT

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

    let mandatoryInsuranceTax = 0.1
    let mandatoryInsuranceComission = 0.0169
    let mandatoryInsurancePrime = 0.0136

    let afp = (salary * mandatoryInsuranceTax) + (salary * mandatoryInsurancePrime) + (salary * mandatoryInsuranceComission)

    let monthlyTax = (impuestoALaRenta / 12)
    let monthlySalary = salary - monthlyTax - afp

    var uiImposedSections = []
    for (var i = 0; i < imposedSections.length; i++) {
      let taxSection = imposedSections[i]
      let title = "Segmento " + (i + 1) + " - " + taxSection.percentage + "%"
      uiImposedSections.push(<RowValue title={title} amount={taxSection.chargedValue} explanation="lalalalalla" />)
    }

    return (
      <Table className="Table">
        <TableBody>
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
          <RowValue title="Aporte a AFP" amount={afp} explanation="lalalalalla" />
          <RowValue title="Sueldo neto mensual" amount={monthlySalary} explanation="lalalalalla" />
        </TableBody>
      </Table>
    )
  }

  render() {
    return (
      <div className="App">
        <Grid item>
          <Paper className="Paper">
            <Typography gutterBottom variant="h3">
              Calcula tu neto!
            </Typography>

            <TextField
              error={this.state.inputError}
              id="salary"
              label="Sueldo mensual"
              onChange={this.handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">S/.</InputAdornment>,
              }}
            />
          </Paper>

          <Paper>
            {this.getRestOfRows()}
          </Paper>
        </Grid>
      </div>
    );
  }
}

export default App;
