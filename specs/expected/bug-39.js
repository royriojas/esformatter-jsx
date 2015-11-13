export default class Register extends Component {

  render() {
    /*esfmt-ignore-start*/
    const {
      forceValidation,
      name,
      email,
      password,
      formState,
      errorMessage,
      validEmail
    } = this.state;

    /*esfmt-ignore-end*/

    const txtClass = formSheet.t('l-text-entry');

    return <div onTap={ ::this.handleLogin } />;
  }
}
