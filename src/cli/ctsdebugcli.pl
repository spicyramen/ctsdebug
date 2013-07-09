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
# This script will obtain CTS System information
# Version 0.1(10041) CLI
#
# TODO: Improve parsing and structures
# TODO: Add CTS 1.9 support
# TODO: Add ctx-log-parser support for CTS
################################################################################################


use warnings;
#use strict;
use Archive::Extract;
use File::Spec;
use LWP::UserAgent;
use HTTP::Request::Common;
use Net::SMTP;
use Net::DNS qw(mx);
use CGI::Carp;

################################################################################################
#Error Handling
################################################################################################


$Archive::Extract::WARN =  0;
$Archive::Extract::DEBUG = 0;
$Archive::Extract::PREFER_BIN = 1;
my $MENULOCATION = "/Users/gogasca/Documents/OpenSource/Development/PerlScripts/ctsdebug/ctsdebugcli/menufile.txt";
open(LOG,">/tmp/ctsanalyzer.log");
*STDERR = *LOG;

&main();
################################################################################################
# Main void main ()
################################################################################################


sub main {

$global_directory = `pwd`;	#Global for current directory 
@global_report =      ();   #Global to store extracted info from files and email
$version = "0.1(10041)";

clear_screen();
print "\n\n\t\tCisco Systems, Inc, TelePresence Infrastructure BU\n";
print "\n\n\t\tInitialzing CTS debug CLI version $version...\n";
print "\t\tCurrent working directory: $global_directory\n\n\n";
press_enter();
menu_option();

while ( $pick ne "x" )
        {
                execute_option();
                menu_option();
        }
exit (0);

}
################################################################################################
# After we select a Menu we clear screen and print Menu again
################################################################################################

sub menu_option
        {
                clear_screen();
                show_menu();
                get_option();
        }

################################################################################################

################################################################################################

sub show_menu
        {
       	my $count = 0;
        		print "\n\t\tCTS debug CLI version $version\n";
        		print "\t\tCurrent directory: $global_directory\n\n\n";
        		open( MENUFILE, "$MENULOCATION") or die "Can't open menufile.txt: $!\n";
        		while ($menurow=<MENUFILE>) {
        			my ($menupick,$menuprompt)=split /:/,$menurow;
        			 print "\t\t$menupick.-\t$menuprompt";
        			++$count;
        		}
        		close MENUFILE;

        		++$count;
        		$count = (12 - $count ) / 2;
                for ($i=0; $i < $count; ++$i){
  	            print "\n";
                }
               	print "\n\n\n\t\tEnter your selection: ";
            }
            
################################################################################################

################################################################################################

sub get_option()
        {
                chomp($pick = <STDIN>);
        }

################################################################################################

################################################################################################

sub execute_option()
        {
                open( MENUFILE, "$MENULOCATION") or die "Can't open menufile.txt: $!\n";
                while ($menurow=<MENUFILE>)  {
	            my ($menupick, $menuprompt)=split /:/,$menurow;
                if ($menupick eq $pick) {
				
				if( $pick eq "a" ) {
					clear_screen();
					extract_files($global_directory);
					@global_report = ();
				} 	
				elsif($pick eq "b") {
  					clear_screen();		
		 	 		change_dir();
				} 
	            elsif($pick eq "c") {			
			        clear_screen();
	            }
  				elsif($pick eq "d") {				
			        print "\t\tFeature available in next version";
			    	press_enter();
			        } 
				else		    {
				print_message("1","Menu file format is incorrect!");
				}

  			}
		}
        close MENUFILE;
		press_enter();
}

################################################################################################

################################################################################################

sub change_dir()
	{
 	my $dir = `pwd`;
	print "\n\t\tCurrent directory: $dir ";
	print "\n\t\tEnter new directory:";
	chomp($dir = <STDIN>);
		unless ($dir) {
			print_message("1","Directory not specified using current directory");
	       		$dir = `pwd`;
			print "\t\t" . $dir;
			return;
		}	
	
	chdir $dir or warn print_message("1","Can't change directory");
	print "\n\t\tListing contents of current directory: $dir\n\n";
	my @files = <.tar.gz *>;
	foreach (sort @files) {
	print "\t\t$_\n";
	}

	$global_directory = $dir;
	$new_dir_flag=1;
	}

################################################################################################

################################################################################################

sub build_dir
	{
	
	my $random_number = rand();
	my $str_dirname = substr($random_number, 2, 7);
	$str_dirname = "Report_" . $str_dirname . "_" . `date +%m %d %Y`;
	# Creating directory: $str_dirname"
	chomp($str_dirname);
	print "\n";
	print "\t\t-  Create a new directory: $str_dirname\n";
	mkdir($str_dirname, 0777) || print $!;
	return $str_dirname;
}

################################################################################################

################################################################################################


sub print_message
	{
	my($message1, $message2) = @_;
	print "\n\n";
		 if( $message1 == "0")    { 
			 print "\t\tINFO:\t" .    $message2;
		 }
		 ##DEBUG##
		 elsif($message1 == "1") {
			 print "\t\t\aWARNING:\t" . $message2;
		 }    
		 ##DEBUG##
		 elsif($message1 == "2")  {
			 print "\t\t\a\aERROR:\t" .   $message2;
		 }
		 print "\n\n";	
}

################################################################################################

################################################################################################

sub send_attachment {

		my $host = "xmb-sjc-23b.amer.cisco.com";  #Enter a Mailbox hostname
        my ($email,$attach,$casenumber) = @_;
        $name = "Cisco Systems, Inc, CTS Analyzer $version This email contains: Report.txt";

		for my $target ( get_mx($host) ) {
			if ($target eq 1){ ## Error
				print_message("2","Email server unreachable!");
				return 1;
			}
		}
		
		## Fix CTS0008, Retry for 30 seconds and debug information, need to catch error before crash
		## Create a new SMTP object
        $smtp = Net::SMTP->new($host,Timeout => 30,Debug => 1);
      
        $smtp->mail("ctsanalyzer\@cisco.com"); #FROM
        if (($attach eq  "1") && ($casenumber ne "0")){ #We want to attach to a case number
                
                $smtp->recipient($email,"email-in\@cisco.com",{ Notify => ['FAILURE','DELAY'], SkipBad => 1 });
                
        }
        else {
                $smtp->to($email);
                $casenumber = "Your Report is ready! ";
        }
        
        $smtp->data();
        $smtp->datasend("From: ctsnalyzer\@cisco.com\n");
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

print "\t\t\aEmail sent...!\n";
return 0;
}

################################################################################################

################################################################################################


sub get_mx {

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
		return 1;
	}
		@mx = map $_->type eq 'A' ? $_->address : (), $query->answer;
	}
	return 1 if !@mx;
	
	# Operation succesful
	return @mx;
}


################################################################################################

################################################################################################


sub enter_email {
        my $email;
        my $SR;
        my $attach;

        print "\n\n\t\tDo you want to email report: \ty/n: ";
        chomp (my $flag = <STDIN>);
        if ($flag eq "Y" || $flag eq "y"){
                while (1) {
		                print "\t\tEnter email: ";
                        chomp($email = <STDIN>);
                        if($email =~ /^([a-zA-Z0-9])+([\.a-zA-Z0-9_-])*@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+/) {
         					last;        
        				}
                        else {
                                print "\t\t\aInvalid email!!\n";
                        }
                }

		## We send email
		&send_attachment ($email,"0","0"); 
		}
        
        else {
           		print "\t\tReport will be processed locally.\n";
        
        }

}

################################################################################################

################################################################################################

sub extract_serial 
	{
	my @serialnumber = @_;
	print "\n\n";
	foreach (@serialnumber){
		if	( $_ =~ m/^UDI_Serial=/ )                {
                	my $codecserialnumber=substr($_,11,11);
                  	print "\t\tCodec Serial :\t $codecserialnumber\n";   	
					&check_serialnumber ("http://serialnumbervalidation.com/63293/cgi-bin/index.cgi",$codecserialnumber); }
		elsif( $_ =~ m/^Display_Serial=/ )                {
        	         my $displayserialnumber=substr($_,15);
	                 chomp ($displayserialnumber);
			  	 	 if ((length($displayserialnumber) eq "11") && ($displayserialnumber =~ m/^Q/)) {		#Display Serial should be 11 characters
					 print "\t\tDisplay :    \t $displayserialnumber\n";
					 &check_serialnumber ("http://serialnumbervalidation.com/63265/cgi-bin/index.cgi",$displayserialnumber);
				
				}
				# Introduce fix for Display INFO: Disconnected
		elsif ($displayserialnumber =~ m/INFO:Display/) {
					print_message("0","Display is Disconnected");
				} 
        else    {
					print "\t\t$_\n";
					print_message("1","Display Serial is not supported!");
				}								
		
		}

	}

}

################################################################################################

################################################################################################


sub check_serialnumber 
	{
	my($url,$serialnumber) = @_;
	my $userAgent = LWP::UserAgent->new(agent => 'perl post');
#	$userAgent->proxy(['http', 'ftp'], 'http://128.107.241.169:80');  ### Enter your PROXY Here
	my $message = "act=process&checklist=" . $serialnumber . "&submit=Submit";
	my $response = $userAgent->request(POST $url,Content_Type => 'application/x-www-form-urlencoded',Content => $message);
	print $response->error_as_HTML unless $response->is_success;

		if($response->content =~ m/Not Affected/i) {
		    print "\t\t$serialnumber INFO:  Device Not affected.\n";  }
		else {
		    print "\t\t$serialnumber ERROR: Device affected!\a\n";			}
}

################################################################################################

################################################################################################

sub extract_files
	{
	# We read Directory from STDIN
	$path = shift  || warn print_message("1","Argument missing: directory name");
	
	if (!$path)
	{
		if ($new_dir_flag eq "1") {
			$path = $global_directory;
		}
		else {
			print_message("0","Directory not specified using current directory");
			$path = `pwd`;
		}
	}
	print "\t\tAccessing files from: $path \n\n";
	chomp($path);
	opendir(DIR,$path) || die print_message("1","Cannot open directory");	
	
	#
	# DDTS CTS0006 Add Support for ZIP file
	#
	
	@str_files = grep(/\.tar.gz$/,readdir(DIR));
	closedir(DIR);

	my $int_file_index=1;
	my $int_count_files=0;

        	foreach (@str_files) {
                  print "\t\t $int_file_index.-  $_\n";
                  $str_file_list[$int_file_index]="$_";
                  $int_count_files++;
                  $int_file_index++;
	        }
			print "\n";
        	print "\t\tTelePresence Log files found: $int_count_files \n\n";
                
			if ($int_count_files == 0){                     	# No files to analyze
			print_message("1","No files found in current directory, change directory or upload TelePresence files with extension .tar.gz");
        	return;
			}

	        print "\t\tSelect (.tar.gz) file from list:  ";
        	chomp($int_cts_file = <STDIN>);
               			
			if (!$int_cts_file){          	# Incorrect file index ****Error catching code
                print_message("1","Incorrect selection");
                return;
                }

			if ( $int_cts_file =~ /^[\+-]*[0-9]*\.*[0-9]*$/ && $int_cts_file !~ /^[\. ]*$/  ) {
				 if ($int_cts_file > $int_count_files) {
				print_message("1","Incorrect selection");
				return;
			}
			}
			else {
				print_message("1","Incorrect selection");
				return;
			}
		
		    ###### Build Report folder
		    
			my $final_dir = build_dir();						# We generate new Folder to extract files
			
		 	print "\t\t-  File selected to analyze: $str_file_list[$int_cts_file]\n";
			print "\t\t-  Report generated and files extracted in: $final_dir\n";		
	        open (IN,"<$str_file_list[$int_cts_file]") or die print_message("2","Can't open file");
			print "\t\t-  Extracting: \t $str_file_list[$int_cts_file]\n\n\t\t\n";
		    
		    
			##### Extracting FILE
			##### Check if tar.gz
			
			unless ( $obj_file = Archive::Extract-> new ( archive => "$str_file_list[$int_cts_file]" ) ) {
			my $str_error = $obj_file->error(1);
			print_message("2","Unable to extract file");
			return;
			} 
			
	        #Fix DDTS CTS003 (Send "Unable to extract file, instead of displaying error in screen, Future version will log errors in trace file)
			#print "\t\tDEBUG: Passed Archive::Extract\n";
			
			unless( $obj_file -> extract (to => $final_dir) ) {
			my $str_error = $obj_file->error(1);
			print_message("2","Unable to extract file");
			return;
  			}
			#print "\t\tDEBUG: Passed Archive::Extract to directory\n";

			unless ( $obj_file -> files ) {
    		my $str_error = $obj_file->error(1);
            print_message("2","Unable to extract file");
            return;
		    }         

			##DEBUG##
			#print "\t\tDEBUG: Passed Archive::Extract list files\n";
			#print "\t\t File extracted with errors : $str_error\n\n";
			
			
       		my $outdir  = $obj_file->extract_path; 					#Retrieve file extracted location
       		print "\n\n\n\n\n\t\tFile extracted in: $outdir";
			##DEBUG##
			#print "\t\t\Report and file succesfully extracted in: $outdir \n\n";
			## DDTS CTS0007 Verify is a valid Telepresence log file	
			
			
			
			if(!&file_check ($outdir))  ## If True not a valid or a corrupted file
			{
			file_read  ($outdir,"1");
			file_read  ($outdir,"2");
			file_read  ($outdir,"3");
			file_read  ($outdir,"4");
			}	
					
			
#			for my $str_file ( @{$obj_file->files} ) {								# Print extracted files
#           print "\t\t$str_file\n";
#       	}

	       close IN;
	       &enter_email();
	       
	       return;

}

################################################################################################

################################################################################################


sub extract_secondary {

                        my($codec,$directory) = @_;
                        my $zipfile;
						my $str_final_dir;
                        
	                		if 	($codec == "2")      {
        	                $zipfile = $directory . "/logFiles.ts2.local.tar.gz";                 
							$str_final_dir  = $directory . "/logFiles.ts2.local";
		                	mkdir($str_final_dir,0777) || print $!;

							}
							elsif 	($codec == "3")
                        	{
        	                $zipfile = $directory . "/logFiles.ts3.local.tar.gz";                 
							$str_final_dir  = $directory . "/logFiles.ts3.local";
                            mkdir($str_final_dir,0777) || print $!;

							}
                        	elsif 	($codec == "4")
                        	{
                	        $zipfile = $directory . "/logFiles.ts4.local.tar.gz";                 
							$str_final_dir  = $directory . "/logFiles.ts4.local";
                            mkdir($str_final_dir,0777) || print $!;
							}


	                   		unless ( $obj_file = Archive::Extract-> new (archive => $zipfile ) ) {
        	                my $str_error = $obj_file->error;
		                    print_message("2","Unable to extract secondary codec files");
        	                return 0;
                	        }
                        
							unless( $obj_file -> extract( to => $str_final_dir ) ) {
                            my $str_error = $obj_file->error;
	        	            print_message("2","Unable to extract secondary codec files");
        	                return 0;
	                        }	
        	                
        	                unless ( $obj_file -> files ) {
                	        my $str_error = $obj_file->error;
               	        	print_message("2","Unable to extract secondary codec files");
	                        return 0;
        	                
        	                }

}

################################################################################################

################################################################################################


sub config_read {

my ($directory,$file) = @_;
my $content= "";
my $openfile = $directory . $file;
open(INPUTFILE, $openfile ) or return 2;
	while (<INPUTFILE>) {
	$content = $_;              
	}
return 0 if $content eq "";
close INPUTFILE;
return $content;                    
}

################################################################################################

################################################################################################

sub pattern_read {

my ($directory,$file,$pattern) = @_;
my $content= "";
my $openfile = $directory . $file;
#print "\t\tAccessing $openfile!\n\n";
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


###Fix for CTS0007

sub file_check {
	my($directory) = @_;	## Directory contains the contents of file extracted
    my @ctsdirectories = qw (/nv /etc /var); #	Verify directory structure exists:
	print "\n\n\t\tVerifying File integrity...\n";
		foreach $myctsdirectory (@ctsdirectories) {
		unless (-d $directory . $myctsdirectory) {
		print_message("2","\t\t\aNot able to find $myctsdirectory folder. Verify it is a valid CTS log file\n");
		return 1;
		}
    }
	
return 0;
}




################################################################################################


sub file_read {


	my($directory, $codec) = @_;
	my $report = $directory . "/report.txt";
	my $ipaddr   = "";				#/nv/log/capture/Showtech_runtime.txt
	my $static_ip = "FALSE";		#Fix for: CTS0003 Display 0.0.0.0 for IP address or no IP address when CTS is using DHCP
	my $validIpAddressRegex = "((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))";

	my $str_key1  = '   <conferenceRoomName>';
	my $str_key2  = '   <tpPhoneNumber>';
	my $str_key3  = '   <timeZone>';
	my $str_key4  = '   <tftpserver1>';
    my $str_key5  = '   <tftpserver2>';
	my $str_keycommon1 = 'ERRORS: 3';


	open (OUTFILE, ">>$report") or die "Can't generate report $!\n";

	%hash = (
		phoneUI 		=> '/nv/log/capture/Showtech_runtime.txt',
		Phone_midlet_status => '/nv/log/capture/showsysinfo.log',
		Phone_midlet_version => '/nv/log/capture/showsysinfo.log',
		TP_MODEL_TEXT 	=> '/nv/log/capture/tsModel.txt',
		OS_Ver          => '/nv/log/capture/showsysinfo.log',
		ipdomainname 	=> '/nv/log/capture/Showtech_runtime.txt',
		netmask 	=> '/nv/log/capture/Showtech_runtime.txt',
		gatewayip 	=> '/nv/log/capture/Showtech_runtime.txt',
		ipdns1 		=> '/nv/log/capture/Showtech_runtime.txt',
		ipdns2 		=> '/nv/log/capture/Showtech_runtime.txt',
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
		Display_Model    => '/nv/log/capture/showsysinfo.log',
        Display_Serial   => '/nv/log/capture/showsysinfo.log',
		$str_keycommon1	 => '/nv/log/capture/vdspstat.log',
    );

	
        if    ($codec == "1") {                                       		# Center codec
			my @serialnumbers 	= ();
			my @patterns		= ();
			my @orderelements 	= ();


			print "\t\tAccessing Center codec files!\n\n";	
			print OUTFILE "\n****Center codec****\n";
			push(@global_report,"Center codec\n");
		
			while( my ($pattern, $file) = each (%hash) ) {
				my $openfile = $directory . $file;		# Obtain correct global path
				chomp $openfile;
				open( INPUTFILE, $openfile ) or warn "$!";
						while (<INPUTFILE>) {		 	
		                	if ( $_ =~ m/^$pattern/ )  {
							push (@patterns,$_);			   
							}
					
						}
	
			}
			close INPUTFILE;
               	
				  			$openfile = $directory . "/nv/log/capture/Showtech_runtime.txt";				               	# Fix issue 2
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


				# SYSTEM INFO
				
				my $cts_man = &config_read($directory,"/nv/state/SRSystemInfo");
				if ($cts_man == 2 || $cts_man == 0 ) {
					$cts_man = "Not configured";
				}
				push(@patterns,"CTS-Man: " . $cts_man);
			
				my $helpdesk = &config_read($directory,"/nv/state/SRHelpDeskNumber");
				if ($helpdesk eq "2" || $helpdesk eq "0" || $helpdesk eq "__NULL__"  ) {
					$helpdesk = "Not configured";
				}
				push(@patterns,"Help Desk: " . $helpdesk);
				
				#
				# System resources
				#
				# HDD resources	/nv/log/capture/Showtech_runtime.txt
				# processor usage 	/nv/log/capture/Showtech_runtime.txt
				# volume    /nv/usr/local/etc/audio-cfg.conf
				# uptime 	/nv/log/capture/uptime.txt


				my @disk_usage = @{&read_multipleline($directory,"/nv/log/capture/Showtech_runtime.txt","system resources:",5)};
				my @cpu_usage = @{&read_multipleline($directory,"/nv/log/capture/Showtech_runtime.txt","processor usage:",10)};
				my $uptime = &config_read($directory,"/nv/log/capture/uptime.txt");
				if ($uptime eq "2" || $uptime eq "0") {
					$uptime = "ERROR: (Invalid Uptime) Open /nv/log/capture/uptime.txt manually";
				}
				
			  	##DEBUG##
			  	
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
                        $orderelements[19] = $_;
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
						elsif ($_ =~ m/^CTS-Man:/) {
                        $orderelements[23] = $_ . "\n";
                        }
			}
			
			
				my $check_tpstatus  =  &pattern_read($directory,"/nv/log/capture/ctsstatus.log","ERROR_COUNT=0");
				
				if($check_tpstatus != 2) 
				{
					if((!$check_tpstatus) and (!&pattern_read($directory,"/nv/log/capture/ctsstatus.log","ERRORS:0")))
					{
					print_message("2","\t\t\aErrors found in Codec verify: ctsstatus.log\n");
					}
				}	
			
			
			foreach (@orderelements) {
                                        if( defined $_ )        {
                                        $_="\t\t$_";
                                        print $_;
                                        print OUTFILE "$_";
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
                        $orderelements[3] = $_;
                        }
                        elsif ($_ =~ m/^Display_Serial/ ) {
                        $orderelements[3] = $_;
                        }

                	}

			foreach (@orderelements) {
				if( defined $_ )        {
				$_="\t\t$_";
				print OUTFILE "$_";
				push(@global_report,$_);
				}
			}

			
			&extract_serial(@serialnumbers);
			
			print "\t\t\n\n";
			print "\t\tCTS System information:\n\n";	
			push(@global_report,"CTS System information:\n\n");			
			
			print "\t\tuptime: $uptime\n";
			print OUTFILE "\t\tUptime: $uptime\n";
			push(@global_report,"\t\tUptime: $uptime\n");
				
			foreach (@disk_usage) {
				$_="\t\t$_\n";
				print "$_";
				print OUTFILE "$_";
				push(@global_report,$_);
			}
			
			print "\t\t\n\n";	
			push(@global_report,"\n\n");			
			
			
			foreach (@cpu_usage) {
				$_="\t\t$_\n";
				print "$_";
				print OUTFILE "$_";
				push(@global_report,$_);
			}
			
			
			close OUTFILE; # CLOSE FILE
						


	}



        elsif   ($codec == "2"){                                        	# Left codec
			my @serialnumbers = ();
            my @orderelements = ();
			if ( -e $directory . "/logFiles.ts2.local.tar.gz"  )	                {
			print "\n\n";
			print "\t\tLeft codec logs found!\n";
            extract_secondary ("2",$directory);			#Unzip ts2.local log files
			print OUTFILE "\n****Left codec****\n";
			push(@global_report,"Left codec\n");

	                while( my ($pattern, $file) = each (%hashcommon) ) {
                       	        $openfile = $directory . "/logFiles.ts2.local" . $file;
                               	open( INPUTFILE, $openfile ) or warn "$!";
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
                        $orderelements[3] = $_;
                        }
                        elsif ($_ =~ m/^Display_Serial/) {
                        $orderelements[3] = $_;
                        }

                        }

                        foreach (@orderelements) {
                        	if( defined $_ )        {
                        		$_="\t\t$_";
                        		print OUTFILE "$_";
								push(@global_report,$_);
                        	}
                        }


			close OUTFILE;
			&extract_serial(@serialnumbers);
         
			}	
        
	
	}
        elsif   ($codec == "3"){                                        # Right codec
			my @serialnumbers = ();
			my @orderelements = ();
	              	if ( -e $directory . "/logFiles.ts3.local.tar.gz" )        	        {
			print "\n\n";
			print "\t\tRight codec logs found!\n";
	                extract_secondary ("3",$directory);
			print OUTFILE "\n****Right codec****\n";
			push(@global_report,"Right codec\n");
	        
		        while( my ($pattern, $file) = each (%hashcommon) ) {
	             	        $openfile = $directory . "/logFiles.ts3.local" . $file;
                        	open( INPUTFILE, $openfile ) or warn "$!";
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
                        elsif ($_ =~ m/^Display_Model/) {
                        $orderelements[3] = $_;
                        }
                        elsif ($_ =~ m/^Display_Serial/) {
                        $orderelements[3] = $_;
                        }
			}

                        foreach (@orderelements) {
                        	if( defined $_ )        {
                        	$_="\t\t$_";
                        	print OUTFILE "$_";
				push(@global_report,$_);
                        	}
                        }

                        close OUTFILE;
			&extract_serial(@serialnumbers);
			
 
		}
        }
        elsif   ($codec == "4"){                                        # Presentation codec
			my @serialnumbers = ();
			my @orderelements = ();
			if ( -e $directory . "/logFiles.ts4.local.tar.gz" )                	{
			print "\n\n";
		        print "\t\tPresentation codec logs found!\n";
		        extract_secondary ("4",$directory);
			print OUTFILE "\n****Presentation codec****\n";
			push(@global_report,"Presentation codec\n");

 	         	
			while( my ($pattern, $file) = each (%hashcommon) ) {
                                $openfile = $directory . "/logFiles.ts4.local" . $file;
                                open( INPUTFILE, $openfile ) or warn "$!";
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
                        elsif ($_ =~ m/^Display_Model/) {
                        $orderelements[4] = $_;
                        }
                        elsif ($_ =~ m/^Display_Serial/) {
                        $orderelements[4] = $_;
                        }

                        }

                        foreach (@orderelements) {
                        	if( defined $_ )        {
                        	$_="\t\t$_";
                        	print OUTFILE "$_";
				push(@global_report,$_);
                        	}
                        }
			close OUTFILE;
			&extract_serial(@serialnumbers);

        	}

        }

}

################################################################################################

################################################################################################

sub clear_screen
        {
                system("clear");
        }

################################################################################################

################################################################################################

sub press_enter
        {
                my $enterinput = 0;
                print "\n\t\tPress Enter to Continue....";
                $enterinput = <STDIN>;
        }



