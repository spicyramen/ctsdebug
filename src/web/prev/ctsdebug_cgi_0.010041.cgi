#!/usr/bin/perl -w
#
################################################################################################
#
# Author: 	Gonzalo Gasca Meza
# Company: 	Cisco Systems, Inc
# Date: 	October 2011
# Name: 	Cisco TelePresence Diagnostics
# This program extract a file, reads contents from a directory and list its contents making sure 
# is a .tar.gz file for TelePresence logs. 
# This script will detect CTS System information
# Version 0.1(10041) CGI
#
# TODO: Improve parsing and structures
################################################################################################

use Archive::Extract;
use CGI;  
use CGI::Carp qw (fatalsToBrowser);  
use File::Spec;
use File::Basename;  
use HTTP::Request::Common;
use LWP::UserAgent;
use Net::SMTP;
use Net::DNS qw(mx);

################################################################################################
# Error Handling
################################################################################################

$Archive::Extract::WARN =  0;
$Archive::Extract::DEBUG = 0;
$Archive::Extract::PREFER_BIN = 1;
my $LOG_LEVEL = 1;
open(LOG,">>/var/www/html/ctsrepository/logs/ctsdiagnostics.log");
*STDERR = *LOG;
$CGI::POST_MAX = 1024 * 15000;  

################################################################################################
# Main program
################################################################################################

my  @global_report =      ();   #Global to store extracted info from files and email
my  $global_directory = "/var/www/html/ctsrepository/";   #Global to store file
my  $global_errors = 0;
my  $global_file = "";
my  $global_version = "1.0(10041)";


&main();

################################################################################################
# Main program
################################################################################################

sub main {

	&debug_log("Main() Starting report",$LOG_LEVEL,0);
	print "Content-type: text/html\n\n";
	my $query = new CGI;
	my $filename	  = "";
	my $email_address = "";
	my $tacsryesno	  = "";
	my $tacsrnum	  = "";
	$filename 			= $query->param("cts_file");  
	$email_address 		= $query->param("email_address");  
	$tacsryesno 		= $query->param("tacsr_attach");  
	$tacsrnum 			= $query->param("tacsrno_attach");  
	my $attachsr = 0;
	my $safe_filename_characters = "a-zA-Z0-9_.-";  
	my $send = "";
	
	&create_textarea();
	
	if ( !$filename )  	{  
	&print_message("2","(ve0) Enter valid TelePresence filename!");
	$global_errors++;
	exit (1);  
	}  

	if (!$email_address)  	{ 
	&print_message("1","ve(0) Enter valid email address. CTS Analisys will continue!");
	$send = &validate_email($email_address);
	}  

	# Remove white spaces from email address in CGI form
	$email_address =~ s/^\s+//;
	$email_address =~ s/\s+//g;
    $email_address =~ s/\s+$//;

	if ($email_address)  	{  
	$send = &validate_email($email_address);
	}  

	&debug_log("DEBUG: Main() CGI INPUT FILE: $filename EMAIL: $email_address ATTACH: $tacsryesno SR: $tacsrnum",$LOG_LEVEL,0);
	if (($tacsryesno eq "on" ) && ($tacsrnum ne "0") && ($tacsrnum ne "")) {
		$attachsr = 1;
		&debug_log("DEBUG: Main() Attaching report to Service Request: ATTACH: $attachsr",$LOG_LEVEL,0);

	}
    
	my ( $name, $path, $extension ) = fileparse ( $filename, '\..*' );  
	$filename = $name . $extension;  
	$filename =~ tr/ /_/;  
	$filename =~ s/[^$safe_filename_characters]//g;  
 
	if ( $filename =~ /^([$safe_filename_characters]+)$/ )  {  
	 $filename = $1;  
	}  
	else  {  
	 &debug_log("Main() Filename contains invalid characters",$LOG_LEVEL,0);
	 die "Filename contains invalid characters";  
	}  
 
	my $upload_filehandle = $query->upload("cts_file");  
	open ( UPLOADFILE, ">$global_directory$filename" ) or die print_message("2","There was a problem uploading your file (main 1) Analisys aborted");  
	binmode UPLOADFILE;  
 
	while ( <$upload_filehandle> )  {  
	print UPLOADFILE;  
}  
 
close UPLOADFILE;

@global_report = ();
&print_message("0","Running TelePresence Diagnostics: $global_version");
&print_message("0","File upload completed $filename");
&extract_files($global_directory,$filename);
&send_attachment($email_address,"0","0") if (!$send);
&send_attachment("email-in\@cisco.com","1",$tacsrnum) if ($attachsr == 1);
&print_message("0","TelePresence Analysis completed");
&print_errors($global_errors);
&create_downloadbutton($global_file) if (!$global_file eq "");
close LOG;
exit (0) if ($global_errors == 0);
exit (1);

}

################################################################################################
#Print javascript to Web page
################################################################################################

sub create_textarea 
{
print <<END_HTML; 
<HTML>
<head>
</head>
<body>
<form id="form1" name="form1">
<fieldset>
<legend><strong><font face="Arial Black, Gadget, sans-serif">Cisco TelePresence Diagnostics Log</font></strong></legend>
<textarea rows="10" cols="140" name="textarea1">
CTS Analyzer results... 
</textarea>
</fieldset>
</form>
</body>
</HTML>
END_HTML
return 0;
}

################################################################################################
#Print Info, Warning or Error message to Web page
################################################################################################

sub print_message
{
	my($message1, $message2) = @_;
    chomp($message1);
    chomp($message2);
    
		 if( $message1 == "0")    { 
			$message1 = "Info: ";
		 }
		 elsif($message1 == "1") {
			$message1 = "Warning: ";
		 }    
		 elsif($message1 == "2")  {
			 $message1 = "Error: ";
	
		}

my $final_message = $message1 . $message2 . '\n';
&debug_log("$final_message",$LOG_LEVEL,0);

print <<END_HTML;  
<HTML>
<HEAD>
<SCRIPT LANGUAGE=JavaScript>;    
var myMessage = window.document.form1.textarea1.value;    
myMessage = myMessage + "$final_message";    
window.document.form1.textarea1.value = myMessage;
</SCRIPT>
</HEAD> 
</HTML>
END_HTML


return 0;
}

################################################################################################
# Print number of errors in File
################################################################################################

sub debug_log
{
my($message, $level,$operation) = @_;
my ($sec, $min, $hour, $mday, $mon, $year, $wday, $yday, $isdst) = localtime(time);
my $stamp = sprintf ("%4d/%02d/%02d %02d:%02d:%02d", $year+1900, $mon+1, $mday, $hour, $min, $sec);

open (DEBUGLOG,">>/var/www/html/ctsrepository/logs/ctsapplication.log") or die print "ERROR: Unable to open ctsapplication.log";
print DEBUGLOG "$stamp $message\n" if ($level eq 1);

if ($operation == 1) {
close DEBUGLOG;
}
return 0;

}

################################################################################################
# Print number of errors in Report
################################################################################################

sub print_errors
{
my $message1 = "Number of error(s) found: ";
my $message2 = shift;
my $final_message = $message1 . $message2 . '\n';
&debug_log("Main() $final_message ",$LOG_LEVEL,1);
print <<END_HTML;  
<HTML>
<HEAD>
<SCRIPT LANGUAGE=JavaScript>;    
var myMessage = window.document.form1.textarea1.value;    
myMessage = myMessage + "$final_message";    
window.document.form1.textarea1.value = myMessage;
</SCRIPT>
</HEAD> 
</HTML>
END_HTML
return 0;
}

################################################################################################
# Create Download button
################################################################################################

sub create_downloadbutton
{
my $report = shift  || warn print_message("1","Argument missing: Path to file");
$report = "/ctsrepository/" . $report . "report.html";
chomp($report);

print <<END_HTML;  
<HTML>
<HEAD>
<form>
<input type="button" name="Button" value="View Report" onClick="window.open('$report', 'download'); return false;">
</form> 
</HEAD> 
</HTML>
END_HTML
return 0;
}

################################################################################################
# Build Directory in Repository folder
################################################################################################

sub create_html_report {

my ($file,$operation,$type,$pattern) = @_;

open (CREATEHTML, ">>$file") or die print_message("2","Cannot generate report $!");

# operation
# 0 = openfile
# 1 = insert value in table
# 2 = close file

# type
# 0 = table
# 1 = value in table
			
if ($operation == 0) {
print CREATEHTML <<END_HTML;  
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
    <html><head><style type="text/css"><!--
    body, td {font-family:Helvetica, sans-serif;font-size:14px;color:#222;}
    a:link, a:active, a:visited, a:hover{text-decoration: underline;color:#3366CC;}
    .title {font-size:16px;font-family:Verdana, Helvetica, sans-serif;color:#111; text-decoration: underline; }
    .label { width: 40em;}
    .value { width: 60em }
    .indent { padding-left: 1em;}
    .lowlight { color: #666; font-style: italic;}
    .highlight { color: #000; font-weight: bold; }
    .legal {font-size:10px;font-family:verdana, Helvetica, sans-serif;color:#999;}
    --></style></head>
    <body>
    <div style="font-size: 20px; font-weight: bold; color: #9f102e">Cisco TelePresence Diagnostics</div>
	<p>The following Cisco TelePresence Diagnostics report has been created:</p>
	<table>
END_HTML
}

if ($operation == 1){

if ($type == 0) {
print CREATEHTML <<END_HTML;  
<tr><td colspan=2 class="title">$pattern</td></tr>	
END_HTML
}

if ($type == 1) {
print CREATEHTML <<END_HTML;  
<tr><td class="indent label">$pattern</td></tr>
END_HTML
}

if ($operation == 2){
print CREATEHTML <<END_HTML;  
</table>
	<br/><br/>
</body></html> 
END_HTML
close CREATEHTML;
}
}
return 0;

}


################################################################################################
# Build Directory in Repository folder
################################################################################################

sub build_dir
{
        my $random_number = rand();
        my $str_dirname = substr($random_number, 2, 12);
        
        $str_dirname = "ctsreport_" . $str_dirname . "/";
        $global_file = $str_dirname;
        $str_dirname =  $global_directory . $str_dirname;
        # Creating directory: $str_dirname"
      
        chomp($str_dirname);
    
        $ENV{"PATH"} = "";
        mkdir($str_dirname,0777) || die print_message("2","Can't create directory $!");
        #&debug_log("(bd1) Folder created succesfully $str_dirname",$LOG_LEVEL);
    	#print_message("0","(bd1) Folder created succesfully $str_dirname");
        return $str_dirname;
}

################################################################################################
# Extract file
################################################################################################

sub extract_files
{
            # We read Directory from STDIN
            #debug_log("extract_files()",$LOG_LEVEL);
            my($path, $ctsfile) = @_;
        	my $int_file_index=1;
			my $int_count_files=0;

        	chomp($path);
            chomp($ctsfile);
            $ENV{"PATH"} = "";
            opendir(DIR,$path) || die print_message("1","Cannot open directory");
                       
			# Verify valid .tar.gz file
			unless ( $ctsfile =~ m/\.tar.gz$/)                {
			print_message("2","No valid file to analyze, please upload TelePresence CTS file");
        	exit (1);
			}
			
            closedir(DIR);

            ###### Build Report folder

            my $final_dir = build_dir();            #We generate new Folder to extract files
            $realpath = $path . $ctsfile;
         
          	print_message("0","(ef0) Extracting Filename: $ctsfile");
			$ENV{"PATH"} = "";
            open (IN,$realpath) or die print_message("2","Can't open file");

		    ##### Extracting FILE
			##### Check if tar.gz
			
			unless ( $obj_file = Archive::Extract-> new (archive => "$realpath")) {
			my $str_error = $obj_file->error(1);
			&print_message("2","(ef2) Unable to extract file $ctsfile");
			$global_errors++;
			exit (1);
			} 
			
	        #Fix DDTS CTS003 (Send "Unable to extract file, instead of displaying error in screen, Future version will log errors in trace file)
			#print_message("0","(ef0) Passed Archive::Extract Read file $realpath succesfully");
			#&debug_log("(ef0) Passed Archive::Extract Read file $realpath succesfully",$LOG_LEVEL);
			
			opendir(DIR,$final_dir) || die print_message("1","Cannot open directory");
			# Folder to open report
         
            closedir(DIR);
			
			#print_message("0","(ef2) Directory: $final_dir is accesible");

			unless( $obj_file -> extract (to => "$final_dir") ) {
			my $str_error = $obj_file->error(1);
			&print_message("2","(ef2) Extracting to directory $final_dir failed. Try again later");
			$global_errors++;
			exit (1);
  			}
			print_message("0","(ef0) Extracting to directory $final_dir was successful");
  		
			unless ( $obj_file -> files ) {
    		my $str_error = $obj_file->error(1);
			&print_message("2","Extracting to directory $final_dir failed");
            $global_errors++;
			exit (1);
		    }         

			##DEBUG##
			#print "\t\tDEBUG: Passed Archive::Extract list files\n";
			#print "\t\t File extracted with errors : $str_error\n\n";
			
	 		my $outdir  = $obj_file -> extract_path; 					#Retrieve file extracted location
			#print_message("0","extract_files(): File extracted in: $outdir");
	 	
			##DEBUG##
			
			## DDTS CTS0007 Verify is a valid Telepresence log file	
			
			if(!&file_check_type ($outdir))  ## Verify type of file
			{
			&file_read  ($outdir,"1");
			&file_read  ($outdir,"2");
			&file_read  ($outdir,"3");
			&file_read  ($outdir,"4");
			}	
	       close IN;
		   return 0;		
}

################################################################################################

################################################################################################

sub extract_secondary 
{
						#debug_log("extract_secondary()",$LOG_LEVEL);
                        my($codec,$directory) = @_;
                        my $zipfile;
						my $str_final_dir;
                        
	                		if 	($codec == "2")      {
        	                $zipfile = $directory . "/logFiles.ts2.local.tar.gz";                 
							$str_final_dir  = $directory . "/logFiles.ts2.local";
		                	mkdir($str_final_dir,0777) || print_message("2","Can't create directory $!");

							}
							elsif 	($codec == "3")
                        	{
        	                $zipfile = $directory . "/logFiles.ts3.local.tar.gz";                 
							$str_final_dir  = $directory . "/logFiles.ts3.local";
                            mkdir($str_final_dir,0777) || print_message("2","Can't create directory $!");

							}
                        	elsif 	($codec == "4")
                        	{
                	        $zipfile = $directory . "/logFiles.ts4.local.tar.gz";                 
							$str_final_dir  = $directory . "/logFiles.ts4.local";
                            mkdir($str_final_dir,0777) || print_message("2","Can't create directory $!");
							}


	                   		unless ( $obj_file = Archive::Extract-> new (archive => $zipfile ) ) {
        	                my $str_error = $obj_file->error;
		                    &print_message("2","Unable to extract secondary codec files");
		                    $global_errors++;
        	                return 0;
                	        }
                        
							unless( $obj_file -> extract( to => $str_final_dir ) ) {
                            my $str_error = $obj_file->error;
	        	            &print_message("2","Unable to extract secondary codec files");
        	                $global_errors++;
        	                return 0;
	                        }	
        	                
        	                unless ( $obj_file -> files ) {
                	        my $str_error = $obj_file->error;
               	        	&print_message("2","Unable to extract secondary codec files");
	                        $global_errors++;
	                        return 0;
        	                
        	                }

}

################################################################################################

################################################################################################

###Fix for CTS0007

sub file_check_type
{
## Directory contains the contents of file extracted
   	#debug_log("file_check_type()",$LOG_LEVEL);
	my($directory) = @_;
	my $type;
	
#	Verify file exists:
	my @ctsdirectories = qw (/nv /etc /var); 		
	foreach $myctsdirectory (@ctsdirectories) {
		unless (-d $directory . $myctsdirectory) {
		&print_message("2","Not able to find $myctsdirectory folder. Verify it is a valid CTS log file");
		$global_errors++;
		return 1;
		}
    }
	print_message("0","Valid CTS file");

return 0;
}

################################################################################################

################################################################################################

sub pattern_read 
{
my ($directory,$file,$pattern) = @_;
my $content= "";
my $openfile = $directory . $file;

open(INPUTFILE, $openfile ) or return 2;
        while (<INPUTFILE>) {
		if ( $_ =~ m/^$pattern/)                {
		$content=$_;               
		##DEBUG
		#print "\t\tDEBUG: Pattern found: $_\n";
		return 1;
		}
	}

close INPUTFILE;
return 0;
}

################################################################################################

################################################################################################

sub config_read 
{
my ($directory,$file) = @_;
my $content= "";
my $openfile = $directory . $file;
open(INPUTFILE, $openfile ) or return "2";

while (<INPUTFILE>) {
	$content = $_;              
}
return 0 if $content eq "";
close INPUTFILE;
return $content;                    
}

################################################################################################

################################################################################################

sub read_multipleline {

my ($directory,$file,$pattern,$num_of_lines) = @_;
my $content = [];
my $index = 0;
my $LINEFOUND = "FALSE";
my $openfile = $directory . $file;
return 2 if ($num_of_lines < 0 || $num_of_lines > 100);


open(INPUTFILE, $openfile ) or return 2;
        while (my $line = <INPUTFILE>) {
       	 chomp $line;
			if ($line =~ m/^$pattern/)                {
				$LINEFOUND = "TRUE";
			}	

			if ($LINEFOUND eq "TRUE" && $index <= $num_of_lines) {
				push (@$content,$line);
				$index++;
			}
		}

close INPUTFILE;
return $content;
}

################################################################################################

################################################################################################


sub read_ip_address {

my $str_param1 = shift;
my $str_param2 = "/nv/log/capture/ifconfig.txt";
my @ipaddresses		= ();
my @masks		= ();

my $str_param3 = $str_param1 . $str_param2;		# Obtain correct global path
chomp $str_param3;
open( INPUTINT, $str_param3 ) or warn "$!";
	while (<INPUTINT>) {
		if ( $_ =~ m/inet addr:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(.*)Mask:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/ )  {
		push (@ipaddresses,$1);
		push (@masks,$3);				   
		}
	}

return ($ipaddresses[0],$masks[0]); 
close INPUTINT;

}

################################################################################################

################################################################################################

sub file_read 
{
	#debug_log("file_read()",$LOG_LEVEL);
	my($directory, $codec) = @_;
	my $textarealine;
	my $report = $directory . "/report.html";
	my $ipaddr   = "";				#/nv/log/capture/Showtech_runtime.txt
	my $static_ip = "FALSE";		#Fix for: CTS0003 Display 0.0.0.0 for IP address or no IP address when CTS is using DHCP
	my $validIpAddressRegex = "((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))";
	my $ip_found  = "FALSE";
	
	my $str_key1 = '   <conferenceRoomName>';
	my $str_key2 = '   <tpPhoneNumber>';
	my $str_key3 = '   <timeZone>';
	my $str_key4 = '   <tftpserver1>';
    my $str_key5 = '   <tftpserver2>';

	#my $str_keycommon1 = 'ERRORS: 3';
	#$str_keycommon1	 => '/nv/log/capture/vdspstat.log',
    
	%hash = (
	phoneUI 	=> '/nv/log/capture/Showtech_runtime.txt',
	Phone_midlet_status => '/nv/log/capture/showsysinfo.log',
	Phone_midlet_version => '/nv/log/capture/showsysinfo.log',
	TP_MODEL_TEXT 	=> '/nv/log/capture/tsModel.txt',
	OS_Ver          => '/nv/log/capture/showsysinfo.log',
	ipdomainname 	=> '/nv/log/capture/Showtech_runtime.txt',
	netmask 	=> '/nv/log/capture/Showtech_runtime.txt',
	gatewayip 	=> '/nv/log/capture/Showtech_runtime.txt',
	ipdns1 		=> '/nv/log/capture/Showtech_runtime.txt',
	ipdns2 		=> '/nv/log/capture/Showtech_runtime.txt',
	ipaddr 		=> '/nv/log/capture/Showtech_runtime.txt',
	ethaddr 	=> '/nv/log/capture/Showtech_runtime.txt',
	eth1addr 	=> '/nv/log/capture/Showtech_runtime.txt',
	eth2addr 	=> '/nv/log/capture/Showtech_runtime.txt',	
	$str_key1  	=> '/nv/usr/local/etc/tp-cfg.xml',
	$str_key2	=> '/nv/usr/local/etc/tp-cfg.xml',
	$str_key3	=> '/nv/usr/local/etc/phoneui-cfg.xml',
	$str_key4	=> '/nv/usr/local/etc/tftp-cfg.xml',
	$str_key5	=> '/nv/usr/local/etc/tftp-cfg.xml',

	);

	%hashcommon = (
        UDI_Hardware_Ver => '/nv/log/capture/showsysinfo.log',
        UDI_Serial 	 => '/nv/log/capture/showsysinfo.log',
        System_Up_Time   => '/nv/log/capture/showsysinfo.log',
		Display_Model    => '/nv/log/capture/showsysinfo.log',
        Display_Serial   => '/nv/log/capture/showsysinfo.log',
		);


        if    ($codec == "1") {                                       		# Center codec
			my @serialnumbers 	= ();
			my @patterns		= ();
			my @orderelements 	= ();

			print_message("0","Accessing Center codec files!");
			push(@global_report,"Center codec\n");
		
			while( my ($pattern, $file) = each (%hash) ) {
				my $openfile = $directory . $file;		# Obtain correct global path
				chomp $openfile;
				open( INPUTFILE, $openfile ) or warn print_message("1","Unable to open file: $openfile  $!");
						while (<INPUTFILE>) {
		                	if ( $_ =~ m/^$pattern/ )  {
							push (@patterns,$_);			   
							}
					
						}
	
			}
			
			close INPUTFILE;
               	        
    			while( my ($pattern, $file) = each (%hashcommon) ) {
                  			$openfile = $directory . $file;
                            open( INPUTFILE, $openfile ) or warn print_message("1","Unable to open file: $openfile $!");
		                    while (<INPUTFILE>) {
								if ( $_ =~ m/^$pattern/)   		{
						 		push (@serialnumbers,$_);		
							 	}							
							}	
                }
	            close INPUTFILE;
				
				$openfile = $directory . "/nv/log/capture/Showtech_runtime.txt";
                            open( INPUTFILE, $openfile ) or warn print_message("1","Unable to open file: $openfile $!");
		                    while (<INPUTFILE>) {
								if ( $_ =~ m/^ipstatic/)   		{
									if ($_ =~ m/false/) {    	 # CTS0003 Fix DHCP Problem to populate below fields 
										$static_ip = "FALSE";    # We are using DHCP, method of obtaining IP is different	#ipstatic=false
                        			}     
                        			elsif ($_ =~ m/true/) {    	 # CTS0003 Fix DHCP Problem to populate below fields 
										$static_ip = "TRUE";
										
                        			}     
							 	}
							}
							
							push (@patterns,"ipstatic=$static_ip\n");
						 	close INPUTFILE;
						 	
						 	# Fix issue 2
				  			$openfile = $directory . "/nv/log/capture/Showtech_runtime.txt";
                            open( INPUTFILE, $openfile ) or warn print_message("1","Unable to open file: $openfile $!");
		                    while (<INPUTFILE>) {
									if ( $_ =~ m/^ipaddr/ && $static_ip eq "TRUE")   		{
										push (@patterns,$_);
									}
							}
						 	close INPUTFILE;
						 	
						 	# Fix issue 2
						 	if ($static_ip eq "FALSE") {
					  			$openfile = $directory . "/nv/log/capture/dhclientinfo.log";
    	                        open( INPUTFILE, $openfile ) or warn print_message("1","Unable to open file: $openfile $!");
			                    while (<INPUTFILE>) {
									if 	($_ =~ m/^CONFIGUREDIP\sis\s$validIpAddressRegex$/ ) {
										push (@patterns,"ipaddr=$1\n");
									}
									}
						 	close INPUTFILE;
						 	}

							if ($ip_found eq "FALSE") {    # CTS0003 Fix DHCP Problem to populate below fields 
								my ($ip,$mask) = &read_ip_address($directory);
								$orderelements[3] = "ipaddress=". $ip . "\n";
				                $orderelements[4] = "netmask=" . $mask . "\n";
				            }        
				            
				            
    						while( my ($pattern, $file) = each (%hashcommon) ) {
                  			$openfile = $directory . $file;
                            open( INPUTFILE, $openfile ) or warn "$!";
			                    while (<INPUTFILE>) {
									if ( $_ =~ m/^$pattern/)   		{
						 			push (@serialnumbers,$_);		
								 	}
								}	
			                }
	        			    close INPUTFILE;

				my $cts_man = &config_read($directory,"/nv/state/SRSystemInfo");
				if ($cts_man eq "2") {
					$cts_man = "Not configured";
				}
				push(@patterns,"CTS-Manager: " . $cts_man);
			
				my $helpdesk = &config_read($directory,"/nv/state/SRHelpDeskNumber");
				if ($helpdesk eq "2" || $helpdesk eq "0" || $helpdesk eq "__NULL__"  ) {
					$helpdesk = "Not configured";
				}
				push(@patterns,"Help Desk: " . $helpdesk);
				
			
				
			  	#	#DEBUG##
			  	#
				# 	System resources
				#
				# 	HDD resources	/nv/log/capture/Showtech_runtime.txt
				# 	processor usage 	/nv/log/capture/Showtech_runtime.txt
				# 	volume    /nv/usr/local/etc/audio-cfg.conf
				# 	uptime 	/nv/log/capture/uptime.txt
				
				my @disk_usage = @{&read_multipleline($directory,"/nv/log/capture/Showtech_runtime.txt","system resources:",5)};
				my @cpu_usage = @{&read_multipleline($directory,"/nv/log/capture/Showtech_runtime.txt","processor usage:",10)};
				
				my $uptime = &config_read($directory,"/nv/log/capture/uptime.txt");
				if ($uptime eq "2" || $uptime eq "0") {
					$uptime = "ERROR: Invalid Uptime: ($uptime) Open /nv/log/capture/uptime.txt manually";
				}
				
				#print "\t\tDEBUG: Ordering elements...\n";
				foreach (@patterns)        {
						##DEBUG##
						#print "\t\tDEBUG: Element found: $_\n";
                       	if ($_ =~ m/^TP_MODEL_TEXT=/ ) {
						$orderelements[0] = $_;
                        }
                        elsif ($_ =~ m/^OS_Ver=/ ) {
                        $orderelements[1] = $_;
                        }
                        elsif ($_ =~ m/^ipstatic/ ) {
						$orderelements[2] = $_;
                        }
                        elsif ($_ =~ m/(^ipaddr)=(.*)/ ) {
                        $orderelements[3] = "ipaddress=" . $2 . "\n";
                        }
                        elsif ($_ =~ m/^netmask/ ) {
                        $orderelements[4] = $_;
                        }
                        elsif ($_ =~ m/^gatewayip/ ) {
                        $orderelements[5] = $_;
                        }
                        elsif ($_ =~ m/^ipdomainname/ ) {
                        $orderelements[6] = $_;
                        }
                        elsif ($_ =~ m/^ipdns1/ ) {
                        $orderelements[7] = $_;
                        }
                        elsif ($_ =~ m/^ipdns2/ ) {
                        $orderelements[8] = $_;
                        }
                        elsif ($_ =~ m/^ethaddr/ ) {
                        $orderelements[9] = $_;
                        }
                        elsif ($_ =~ m/^eth1addr/ ) {
                        $orderelements[10] = $_;
                        }
                        elsif ($_ =~ m/^eth2addr/ ) {
                        $orderelements[11] = $_;
                        }
                        elsif ($_ =~ m/^phoneUI/ ) {
                        $orderelements[12] = $_;
                        }
                        elsif ($_ =~ m/^Phone_midlet_status/ ) {
                        $orderelements[13] = $_;
                        }
                        elsif ($_ =~ m/^Phone_midlet_version/ ) {
                        $orderelements[14] = $_;
                        }
                        elsif ($_ =~ m/^Display_Model/) {
                        $orderelements[15] = $_;
                        }
                        elsif ($_ =~ m/^Display_Serial/) {
                        $orderelements[16] = $_;
                        }
						elsif ($_ =~ m/$str_key1/) {
						$_ =~ /\>(.*?)\</;
						$orderelements[17] = "conferenceRoomName: " . $1 . "\n";
                        }
 						elsif ($_ =~ m/$str_key2/) {
						$_ =~ /\>(.*?)\</;
                        $orderelements[18] = "tpPhoneNumber: " . $1 . "\n";
                        }
                        elsif ($_ =~ m/^Help/) {
                        $orderelements[19] = $_ . "\n";
                        }
 						elsif ($_ =~ m/$str_key3/) {
						$_ =~ /\>(.*?)\</;
                        $orderelements[20] = "Timezone: " . $1 . "\n";
                        }           
						elsif ($_ =~ m/^$str_key4/) {
                        $_ =~ /\>(.*?)\</;
                        $orderelements[21] = "TFTP 1: " . $1 . "\n";
                        }
	                	elsif ($_ =~ m/^$str_key5/) {
                       	 $_ =~ /\>(.*?)\</;
                        	if (!($1 eq "")){
							$orderelements[22] = "TFTP 2: " . $1 . "\n";
    	                    }
						}
						elsif ($_ =~ m/^CTS-Manager:/) {
                        $orderelements[23] = $_ . "\n";
                        }
			
			
			}
			
		
			my $check_tpstatus  =  &pattern_read($directory,"/nv/log/capture/ctsstatus.log","ERROR_COUNT=0");
				
				if($check_tpstatus != 2) 
				{
					if((!$check_tpstatus) and (!&pattern_read($directory,"/nv/log/capture/ctsstatus.log","ERRORS:0")))
					{
					print_message("2","Errors found in Codec verify: ctsstatus.log");
					$global_errors++;
					}
				}	
				
		
	        
            &create_html_report($report,0); #open file
            &create_html_report($report,1,0,"Center codec"); 
        
			
			foreach (@orderelements) {
                                        if( defined $_ )        {
                                        &create_html_report($report,1,1,"$_");
										push(@global_report,$_);
                                        }
                        }

		
			@orderelements = ();
	
			foreach (@serialnumbers)        {
       
                        if ($_ =~ m/^UDI_Hardware/ ) {
                        $orderelements[1] = $_;
                        }
                        elsif ($_ =~ m/^UDI_Serial/ ) {
                        $orderelements[2] = $_;
                        }
                        elsif ($_ =~ m/^Display_Model/ ) {
                        $orderelements[4] = $_;
                        }
                        elsif ($_ =~ m/^Display_Serial/ ) {
                        $orderelements[4] = $_;
                        }

                	}

			foreach (@orderelements) {
				if( defined $_ )        {
				&create_html_report($report,1,1,"$_");
				push(@global_report,$_);
				}
			}
			
			push(@global_report,"\tSystem information:\n\n");			
			&create_html_report($report,1,0,"System information"); 
			
			
			&create_html_report($report,1,1,"uptime: $uptime");
			push(@global_report,"\tUptime: $uptime\n");
						
			foreach (@disk_usage) {
				$_="\t$_\n";
				&create_html_report($report,1,1,"$_");
				push(@global_report,$_);
			}
			
			push(@global_report,"\n\n");						
			
			foreach (@cpu_usage) {	
				$_="\t$_\n";
				&create_html_report($report,1,1,"$_");
				push(@global_report,$_);
			}
			
	&extract_serial(@serialnumbers);
	}



        elsif   ($codec == "2"){                                        	# Left codec
			my @serialnumbers = ();
            my @orderelements = ();
			if ( -e $directory . "/logFiles.ts2.local.tar.gz"  )	                {
			print_message("0","Left codec files found");
            extract_secondary ("2",$directory);			#Unzip ts2.local log files
			&create_html_report($report,1,0,"Left codec");
			push(@global_report,"\nLeft codec\n");

	                while( my ($pattern, $file) = each (%hashcommon) ) {
                       	        $openfile = $directory . "/logFiles.ts2.local" . $file;
                               	open( INPUTFILE, $openfile ) or warn print_message("1","Unable to open file: $openfile $!");
								while (<INPUTFILE>) {
                	             	if ( $_ =~ m/^$pattern/ )   	{
									push (@serialnumbers,$_);	
									}
         	                   }
                	}
                        close INPUTFILE;
                        
					foreach (@serialnumbers)        {
                        if ($_ =~ m/^OS_Ver=/ ) {
                        $orderelements[0] = $_;
                        }
                        elsif ($_ =~ m/^UDI_Hardware/) {
                        $orderelements[1] = $_;
                        }
                        elsif ($_ =~ m/^UDI_Serial/) {
                        $orderelements[2] = $_;
                        }
                        elsif ($_ =~ m/^Display_Model/) {
                        $orderelements[4] = $_;
                        }
                        elsif ($_ =~ m/^Display_Serial/) {
                        $orderelements[4] = $_;
                        }

                        }

                        foreach (@orderelements) {
                        	if( defined $_ )        {
								&create_html_report($report,1,1,"$_");	
								push(@global_report,$_);
                        	}
                        }

			&extract_serial(@serialnumbers);
         
			}	
	
	}
        elsif   ($codec == "3"){                                        # Right codec
			my @serialnumbers = ();
			my @orderelements = ();
	        if ( -e $directory . "/logFiles.ts3.local.tar.gz" )        	        {
			print_message("0","Right codec files found");
	        extract_secondary ("3",$directory);
			&create_html_report($report,1,0,"Right codec");	
			push(@global_report,"\nRight codec\n");
	        
		        while( my ($pattern, $file) = each (%hashcommon) ) {
	             	        $openfile = $directory . "/logFiles.ts3.local" . $file;
                        	open( INPUTFILE, $openfile ) or warn print_message("1","Unable to open file: $openfile $!");
					        while (<INPUTFILE>) {
							if ( $_ =~ m/^$pattern/ )   	{     
							push (@serialnumbers,$_);   	}
                                       		}
                        }
                        close INPUTFILE;
				foreach (@serialnumbers)        {
                        if ($_ =~ m/^OS_Ver=/ ) {
                        $orderelements[0] = $_;
                        }
                        elsif ($_ =~ m/^UDI_Hardware/) {
                        $orderelements[1] = $_;
                        }
                        elsif ($_ =~ m/^UDI_Serial/) {
                        $orderelements[2] = $_;
                        }
                        elsif ($_ =~ m/^System_Up_Time/) {
                        $orderelements[3] = $_;
                        }
                        elsif ($_ =~ m/^Display_Model/) {
                        $orderelements[4] = $_;
                        }
                        elsif ($_ =~ m/^Display_Serial/) {
                        $orderelements[4] = $_;
                        }
			}

                        foreach (@orderelements) {
                        	if( defined $_ )        {
						 	&create_html_report($report,1,1,"$_");	
                        	push(@global_report,$_);
                        	}
                        }

						&extract_serial(@serialnumbers);
			
 
		}
        }
        elsif   ($codec == "4"){                                        # Presentation codec
			my @serialnumbers = ();
			my @orderelements = ();
			if ( -e $directory . "/logFiles.ts4.local.tar.gz" )                	{
		       	print_message("0","Presentation codec files found");
				extract_secondary ("4",$directory);
				&create_html_report($report,1,0,"Presentation codec");	
				push(@global_report,"\nPresentation codec\n");

 	         	
			while( my ($pattern, $file) = each (%hashcommon) ) {
                        $openfile = $directory . "/logFiles.ts4.local" . $file;
                        open( INPUTFILE, $openfile ) or warn print_message("1","Unable to open file: $openfile $!");
					    while (<INPUTFILE>) {
                       	if ( $_ =~ m/^$pattern/ )   		{                               	                 
						push (@serialnumbers,$_);   		}
                                       }
                        }
                        close INPUTFILE;

                        foreach (@serialnumbers)        {
                        if ($_ =~ m/^OS_Ver=/ ) {
                        $orderelements[0] = $_;
                        }
                        elsif ($_ =~ m/^UDI_Hardware/) {
                        $orderelements[1] = $_;
                        }
                        elsif ($_ =~ m/^UDI_Serial/) {
                        $orderelements[2] = $_;
                        }
                        elsif ($_ =~ m/^System_Up_Time/) {
                        $orderelements[3] = $_;
                        }
                        elsif ($_ =~ m/^Display_Model/) {
                        $orderelements[4] = $_;
                        }
                        elsif ($_ =~ m/^Display_Serial/) {
                        $orderelements[4] = $_;
                        }
                        }

                        foreach (@orderelements) {
                        	if( defined $_ )        {
							&create_html_report($report,1,1,"$_");	
							push(@global_report,$_);
                        	}
                        }
			&create_html_report($report,2);	
			&extract_serial(@serialnumbers);

        	}

        }


			
}

################################################################################################

################################################################################################

sub send_attachment 
{

		my $host = "xmb-sjc-23b.amer.cisco.com";  #Enter a Mailbox hostname
        my ($email,$attach,$casenumber) = @_;
        my $name = "Cisco Systems, Inc, CTS Analyzer. This email contains your Report";

		unless($email =~ /^([a-zA-Z0-9])+([\.a-zA-Z0-9_-])*@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+/) {
        return 1;        
        }
		
		&debug_log("DEBUG: send_attachment() EMAIL: $email ATTACH: $attach SR: $casenumber",$LOG_LEVEL,0);
		
		for my $target ( get_mx($host) ) {
			if ($target eq 1){ ## Error
				print_message("2","Email server unreachable!");
				$global_errors++;
				return 1;
			}
		}
		
		## Fix CTS0008, Retry for 15 seconds and debug information, need to catch error before crash
		## Create a new SMTP object
        my $smtp = Net::SMTP->new($host,Timeout => 15,Debug => 1);

        $smtp->mail("ctsanalyzer\@cisco.com"); #FROM
        if (($attach == 1) && ($casenumber ne "0")){ #We want to attach to a case number
        &debug_log("DEBUG: send_attachment() Attaching report to SR: EMAIL: $email ATTACH: $attach SR: $casenumber",$LOG_LEVEL,0);
        }
        else {
                $smtp->to($email);
                $casenumber = "Your Report is ready! ";
        }

      	&debug_log("DEBUG: send_attachment() EMAIL: $email ATTACH: $attach SR: $casenumber",$LOG_LEVEL,0);
        
        $smtp->data();
        $smtp->datasend("From: ctsanalyzer\@cisco.com\n");
        $smtp->datasend("To: $email\n");
        $smtp->datasend("Subject: $casenumber CTS Analyzer Report\n");
        $smtp->datasend("MIME-Version: 1.0\n");
        $smtp->datasend("$name\n");
        
		foreach (@global_report) {
			if( defined $_ )        {
			$_="\t\t$_";
			$smtp->datasend("$_");
            }
        }
		$smtp->datasend();
   		$smtp-> dataend();                                                #We finish sending email
    	$smtp-> send();
    	$smtp-> quit();

print_message("0","Email attach to SR $casenumber: !") if $attach == 1;
print_message("0","Email sent to $email...!") if $attach == 0;
return 0;
}

################################################################################################

################################################################################################

sub validate_email 
{		
		my $email = shift || return 1;
		&print_message("0","Verifying email: '$email'");
	    if($email =~ /^([a-zA-Z0-9])+([\.a-zA-Z0-9_-])*@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+/) {
        return 0;        
        }
        else {
        print_message("1","(ve0) Invalid email address. CTS Analisys will continue!");
        $global_errors++;
        return 1;
        }
}

################################################################################################

################################################################################################
sub get_mx 
{

my ($domain) = @_;
my $res = Net::DNS::Resolver->new();
my @mx = mx( $res, $domain );

if (@mx) {
	@mx = map $_-> exchange, @mx;
} 
else {
	# Fallback to A if no MX found
	my $query = $res->search($domain);
	if ( !$query ) {
		print_message("2","$domain A record lookup failed " . $res->errorstring);
		$global_errors++;
		return 1;
	}
		@mx = map $_->type eq 'A' ? $_->address : (), $query->answer;
	}
	return 1 if !@mx;
	
	# Operation successful
	return @mx;
}


################################################################################################

################################################################################################

sub extract_serial 
{
	my @serialnumber = @_;
	foreach (@serialnumber){
		if	( $_ =~ m/^UDI_Serial=/ )                {
                	my $codecserialnumber=substr($_,11,11);
#                  	print "\t\tCodec Serial :\t $codecserialnumber\n";   	
					&check_serialnumber ("http://serialnumbervalidation.com/63293/cgi-bin/index.cgi",$codecserialnumber,1); }
		elsif( $_ =~ m/^Display_Serial=/ )                {
					 chomp;
					 my $realdisplayserialnumber= $_;
        	         my $displayserialnumber=substr($_,15);
	    	  	 	 if ((length($displayserialnumber) eq "11") && ($displayserialnumber =~ m/^Q/)) {#Display Serial should be 11 characters
#					 print "\t\tDisplay :    \t $displayserialnumber\n";
					 &check_serialnumber ("http://serialnumbervalidation.com/63265/cgi-bin/index.cgi",$displayserialnumber,2);
				
				}
				# Introduce fix for Display INFO: Disconnected
		elsif ($displayserialnumber =~ m/INFO:Display/) {
					&print_message("1","Display is Disconnected");
				} 
		elsif ($displayserialnumber =~ m/INFO: N\/A/) {
					&print_message("1","Display Info Not available");
				} 
				
        else    {
					&print_message("1","Display Serial is not supported!");
					$global_errors++;
				}								
		
		}

	}

}

################################################################################################

################################################################################################

sub check_serialnumber 
{
	my($url,$serialnumber,$devicetype) = @_;
	my $userAgent = LWP::UserAgent->new(agent => 'perl post');
	$userAgent->proxy(['http', 'ftp'], 'http://128.107.241.169:80');  ### Enter your PROXY Here
	$userAgent->timeout(10); 										  ### Add delay
	my $message = "act=process&checklist=" . $serialnumber . "&submit=Submit";
	my $response = $userAgent->request(POST $url,Content_Type => 'application/x-www-form-urlencoded',Content => $message);
	
	%deviceMatrix = (
  	"1" => "Codec",
  	"2" => "Display",
  	"3" => "Future",
	);

my $type = $deviceMatrix {lc $devicetype} || "Unknown";
		if ($response->is_success) {
			if($response->content =~ m/Not Affected/i) {
				print_message("0","$type $serialnumber not affected by 63293") if ($type eq "Codec");
				print_message("0","$type $serialnumber not affected by 63265") if ($type eq "Display");
		    }
			else {
				print_message("2","$type $serialnumber affected by Field Notice 63293") if ($type eq "Codec");
				print_message("2","$type $serialnumber affected by Field Notice 63265") if ($type eq "Display");
				$global_errors++;
		    }
		}
		else
		{
		 my $code = $response->code();
         print_message("1","HTTP Error: $code .No Internet Connectivity");
		 $global_errors++;
		}
}	
