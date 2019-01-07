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

    var amountColor = "default"
    if (this.props.amount < 0) {
      amountColor = "error"
    }

    return (
      <TableRow>
        <TableCell component="th" scope="row">
          {this.props.title}
          <IconButton aria-label="Info" onClick={this.handleOpen}>
            <InfoIcon></InfoIcon>
          </IconButton>
        </TableCell>
        <TableCell align="right">
          <Typography color={amountColor}>
            {"S/." + this.props.amount}
          </Typography>
        </TableCell>
        <Dialog
          onClose={this.handleClose}
          aria-labelledby="customized-dialog-title"
          open={this.state.open}>
          <MuiDialogTitle id="customized-dialog-title">
            {this.props.title}
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
    if (!isNaN(salary)) {
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
    var descuentoUIT = UIT * 7
    var remuneracionBrutaAnual = anualSalary
    remuneracionBrutaAnual += grati
    remuneracionBrutaAnual += vacaciones
    remuneracionBrutaAnual += cts

    if (remuneracionBrutaAnual < descuentoUIT) {
      descuentoUIT = remuneracionBrutaAnual
    }

    let remuneracionNetaAnual = remuneracionBrutaAnual - descuentoUIT


    var impuestoALaRenta = 0
    var secciones = [0, 5, 20, 35, 45]
    var porcentajes = [8, 14, 17, 20, 30]
    var imposedSections = []

    for (var i = 0; i < porcentajes.length - 1; i++) {
      var impuesto = 0
      var min = secciones[i] * UIT
      var max = secciones[i + 1] * UIT
      var porcentaje = porcentajes[i] / 100
      if (remuneracionNetaAnual > min && remuneracionNetaAnual <= max) {
        impuesto = (remuneracionNetaAnual - min) * porcentaje
      } else if (remuneracionNetaAnual > min) {
        impuesto = ((max - min) * porcentaje)
      }
      if (impuesto == 0) {
        break
      }
      imposedSections.push({
        percentage: porcentajes[i],
        chargedValue: impuesto,
        minSegment: secciones[i],
        maxSegment: secciones[i + 1]
      })
      impuestoALaRenta += impuesto
    }

    let lastLimit = (secciones[secciones.length - 1] * UIT)
    if (remuneracionNetaAnual > lastLimit) {
      let lastPercentage = (porcentajes[porcentajes.length - 1] / 100)
      console.log("lastPercentage" + lastPercentage)
      let lastSection = (remuneracionNetaAnual - lastLimit) * lastPercentage
      console.log("lastSection" + lastSection)
      impuestoALaRenta += lastSection
      imposedSections.push({
        percentage: porcentajes[porcentajes.length - 1],
        chargedValue: lastSection,
        minSegment: secciones[secciones.length - 1]
      })
    }

    let mandatoryInsuranceTax = 0.1
    let mandatoryInsuranceComission = 0.0169
    let mandatoryInsurancePrime = 0.0136

    let afp = (salary * mandatoryInsuranceTax) + (salary * mandatoryInsurancePrime) + (salary * mandatoryInsuranceComission)

    let monthlyTax = (impuestoALaRenta / 12)
    let monthlySalary = salary - monthlyTax - afp
    var uiImpuestoALaRenta = []
    if (remuneracionNetaAnual > 0) {
      uiImpuestoALaRenta.push(
        <RowValue title="Sueldo anual" amount={anualSalary.toFixed(2)} explanation="Este es tu sueldo multiplicado por los 12 meses que esperas trabajar en el año" />,
        <RowValue title="Gratificaciones" amount={grati.toFixed(2)} explanation="Este es el total de gratificaciones que vas a percibir incluyendo el 8% de ESSALUD" />,
        <RowValue title="Vacaciones" amount={vacaciones.toFixed(2)} explanation="Este es el sueldo adicional por vacaciones" />,
        <RowValue title="CTS" amount={cts.toFixed(2)} explanation="Este es el sueldo adicional por CTS" />,
        <RowValue title="Remuneracion Bruta Anual" amount={remuneracionBrutaAnual.toFixed(2)} explanation="Esta es la suma de tu sueldo anual mas gratificaciones, vacaciones y CTS" />,
        <RowValue title="Descuento de hasta 7 UITs" amount={-descuentoUIT.toFixed(2)} explanation="Este es un beneficio que otorga la SUNAT en el calculo del impuesto a la renta, te descuentan hasta 7 UITs" />,
        <RowValue title="Remuneracion Neta Anual" amount={remuneracionNetaAnual.toFixed(2)} explanation="Esta es la remuneracion neta sobre la cual se calcula el impuesto a la renta con el beneficio del descuento de las 7 UITs" />
      )
      uiImpuestoALaRenta.push(
        imposedSections.map(function (item, i) {
          var title = ""
          var explanation = ""
          if (item.maxSegment) {
            title = "Segmento " + (i + 1) + " (" + item.minSegment + " UIT - " + item.maxSegment + " UIT) - " + item.percentage + "%"
            explanation = "Este es el segmento " + (i + 1) + ", por el cual debes pagar " + item.percentage + "% desde " + item.minSegment + " UITs hasta " + item.maxSegment + " UITs"
          } else {
            title = "Segmento " + (i + 1) + " (" + item.minSegment + " UIT o más) - " + item.percentage + "%"
            explanation = "Este es el segmento " + (i + 1) + ", por el cual debes pagar " + item.percentage + "% desde " + item.minSegment + " UITs en adelante"
          }

          return <RowValue title={title} amount={-item.chargedValue.toFixed(2)} explanation={explanation} />
        })
      )
      uiImpuestoALaRenta.push(
        <RowValue title="Impuesto a la renta anual proyectado" amount={-impuestoALaRenta.toFixed(2)} explanation="Este es el total de impuesto a la renta que debes pagar en el año" />,
        <RowValue title="Impuesto a la renta mensual" amount={-monthlyTax.toFixed(2)} explanation="Este seria el monton mensual que se descuenta por impuesto a la renta" />)
    }

    return (
      <Table className="Table">
        <TableBody>
          <RowValue title="Sueldo mensual" amount={salary.toFixed(2)} explanation="Este es tu sueldo mensual" />
          {uiImpuestoALaRenta}
          <RowValue title="Aporte a AFP" amount={-afp.toFixed(2)} explanation="Esto es un aproximado de lo pagarias por AFP" />
          <RowValue title="Sueldo neto mensual" amount={monthlySalary.toFixed(2)} explanation="Este es tu sueldo neto mensual" />
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
