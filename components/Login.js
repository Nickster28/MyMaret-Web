import React from 'react'
import DocumentTitle from 'react-document-title'
import Parse from '../ParseWrapper'
import { browserHistory } from 'react-router'

export default class Login extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);

		this.state = {username: '', password: '', error: ''};
	}

	handleSubmit(e) {
		e.preventDefault();
		Parse.User.logIn(this.state.username, this.state.password).then(function() {
			browserHistory.push('/');
		}, function(error) {
			this.setState({username: '', password: '', error: error.message});
		});
	}

	handleUsernameChange(e) {
		this.setState({username: e.target.value});
	}

	handlePasswordChange(e) {
		this.setState({password: e.target.value});
	}

	errorMessage() {
		if (this.state.error) {
			return (
				<div className="alert alert-danger">
					<strong>Error: </strong>
					{this.state.error}
				</div>
			)
		} else {
			return '';
		}
	}

  	render() {
    	return (
    		<DocumentTitle title="MyMaret | Log In">
    			<div id="loginScreen">
    				<div id="loginBox">
    					<img src="/logo.png" id="mymaretLoginLogo" className="img-responsive" />
    					<form id="loginForm" className="form-horizontal" onSubmit={this.handleSubmit}>
    						{this.errorMessage()}
    						<input type="text" className="form-control" placeholder="Username" value={this.state.username} onChange={this.handleUsernameChange} />
    						<input type="password" className="form-control" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange} />
    						<input type="submit" value="Log In" className="btn btn-default" />
    					</form>
    				</div>
    			</div>
    		</DocumentTitle>
    	)
  	}
}