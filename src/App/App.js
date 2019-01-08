import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';
import './App.css';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/InfoOutlined'
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Divider from '@material-ui/core/Divider';
import Input from '@material-ui/core/Input';

class RowValue extends Component {

  constructor(props) {
    super(props);
    var isMoney = true
    console.log("antes del if")
    if(this.props.money === undefined) {
      isMoney = true
    } else {
      isMoney = false
    }
    this.state = {
      open: false,
      isMoney: isMoney
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
      <ListItem>
          <Grid className="aligned" container xs={9} sm={9}>
          <IconButton aria-label="Info" onClick={this.handleOpen}>
            <InfoIcon></InfoIcon>
          </IconButton>
          <Typography>{this.props.title}</Typography>
          </Grid>
          <Grid item xs={3} sm={3}>
          <Typography className="wrappedText" color={amountColor}>{ (this.state.isMoney ? "S/." : "") + this.props.amount}</Typography>
          </Grid>
        
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
      </ListItem>
    )
  }
}

const UIT = [
  {
    year: 2019,
    amount: 4200
  },
  {
    year: 2018,
    amount: 4150
  },
  {
    year: 2017,
    amount: 4050
  },
]

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      salary: 0,
      inputError: false,
      UIT: UIT[0].amount
    }
    this.handleSalaryChange = this.handleSalaryChange.bind(this)
    this.handleUITChange = this.handleUITChange.bind(this)
    this.getRestOfRows = this.getRestOfRows.bind(this)
  }

  handleSalaryChange(e) {
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

  handleUITChange(e) {
    let newUIT = e.target.value
    this.setState({
      UIT: newUIT
    })
  }

  getRestOfRows() {

    let selectedUIT = this.state.UIT
    let essalud = 0.08

    let salary = Number(this.state.salary)
    let anualSalary = salary * 12
    let grati = salary * 2 * (1 + essalud)
    var descuentoUIT = selectedUIT * 7
    var remuneracionBrutaAnual = anualSalary
    remuneracionBrutaAnual += grati

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
      var min = secciones[i] * selectedUIT
      var max = secciones[i + 1] * selectedUIT
      var porcentaje = porcentajes[i] / 100
      if (remuneracionNetaAnual > min && remuneracionNetaAnual <= max) {
        impuesto = (remuneracionNetaAnual - min) * porcentaje
      } else if (remuneracionNetaAnual > min) {
        impuesto = ((max - min) * porcentaje)
      }
      if (impuesto === 0) {
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

    let lastLimit = (secciones[secciones.length - 1] * selectedUIT)
    if (remuneracionNetaAnual > lastLimit) {
      let lastPercentage = (porcentajes[porcentajes.length - 1] / 100)
      let lastSection = (remuneracionNetaAnual - lastLimit) * lastPercentage
      impuestoALaRenta += lastSection
      imposedSections.push({
        percentage: porcentajes[porcentajes.length - 1],
        chargedValue: lastSection,
        minSegment: secciones[secciones.length - 1]
      })
    }

    let mandatoryInsuranceTax = 0.1
    let mandatoryInsuranceComission = 0.0169

    let afp = (salary * mandatoryInsuranceTax) + (salary * mandatoryInsuranceComission)

    let monthlyTax = (impuestoALaRenta / 12)
    let monthlySalary = salary - monthlyTax - afp
    
    let percentageOfSalary = salary > 0 ? (monthlySalary/salary)*100 : 0


    var uiImpuestoALaRenta = []
    if (remuneracionNetaAnual > 0) {
      uiImpuestoALaRenta.push(
        <RowValue title="Sueldo anual" amount={anualSalary.toFixed(2)} explanation="Este es tu sueldo multiplicado por los 12 meses que esperas trabajar en el año" />,
        <RowValue title="Gratificaciones" amount={grati.toFixed(2)} explanation="Este es el total de gratificaciones que vas a percibir incluyendo el 8% de ESSALUD" />,
        <Divider />,
        <RowValue title="Remuneracion Bruta Anual" amount={remuneracionBrutaAnual.toFixed(2)} explanation="Esta es la suma de tu sueldo anual mas gratificaciones, vacaciones y CTS" />,
        <RowValue title="Descuento de hasta 7 UITs" amount={-descuentoUIT.toFixed(2)} explanation="Este es un beneficio que otorga la SUNAT en el calculo del impuesto a la renta, te descuentan hasta 7 UITs" />,
        <Divider />,
        <RowValue title="Remuneracion Neta Anual" amount={remuneracionNetaAnual.toFixed(2)} explanation="Esta es la remuneracion neta sobre la cual se calcula el impuesto a la renta con el beneficio del descuento de las 7 UITs" />,
        <Divider />
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
        <Divider />,
        <RowValue title="Impuesto a la renta anual proyectado" amount={-impuestoALaRenta.toFixed(2)} explanation="Este es el total de impuesto a la renta que debes pagar en el año" />,
        <RowValue title="Impuesto a la renta mensual" amount={-monthlyTax.toFixed(2)} explanation="Este seria el monton mensual que se descuenta por impuesto a la renta" />)
    }

    return (
      <List>
          {uiImpuestoALaRenta}
          <RowValue title="Aporte a AFP" amount={-afp.toFixed(2)} explanation="Esto es un aproximado de lo pagarias por AFP" />
          <Divider />
          <RowValue title="Sueldo neto mensual" amount={monthlySalary.toFixed(2)} explanation="Este es tu sueldo neto mensual" />
          <RowValue title="Porcentaje del sueldo" money={false} amount={percentageOfSalary.toFixed(2) + "%"} explanation="Este es el porcentaje de tu salario que realmente recibes" />
      </List>
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
            <FormControl >
              <InputLabel shrink htmlFor="age-native-label-placeholder">
                Año
              </InputLabel>
              <NativeSelect
                value={this.state.UIT}
                onChange={this.handleUITChange}
                input={<Input name="age" id="age-native-label-placeholder" />}
              >
                {
                  UIT.map(function (item, i) {
                    return <option value={item.amount}>{item.year}</option>
                  })
                }
              </NativeSelect>
              <FormHelperText>Año</FormHelperText>
            </FormControl>
            <TextField
              error={this.state.inputError}
              id="salary"
              label="Sueldo mensual"
              onChange={this.handleSalaryChange}
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
