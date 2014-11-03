
function ResetValidator(){
    
// modal window to allow users to reset their password //
    this.setPasswordAlert = $('#status-message');
}

ResetValidator.prototype.validatePassword = function(s)
{
	if (s.length >= 8){
		return true;
	}	else{
		this.showAlert('Password should be atleast 8 characters long');
		return false;
	}
}

ResetValidator.prototype.showAlert = function(m)
{
	this.setPasswordAlert.attr('class', 'alert alert-danger');
	this.setPasswordAlert.html(m);
	this.setPasswordAlert.show();
}

ResetValidator.prototype.hideAlert = function()
{
    this.setPasswordAlert.hide();
}

ResetValidator.prototype.showSuccess = function(m)
{
	this.setPasswordAlert.attr('class', 'alert alert-success');
	this.setPasswordAlert.html(m);
	this.setPasswordAlert.fadeIn(500);
}