<!DOCTYPE html>
<html>
    <head> 
        <meta charset="UTF-8">
        <title>Biocore Test Case</title>
        <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>
	    <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
        <link href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
        <link rel="stylesheet" href="css/cytoscape.js-panzoom.css">
        <link href="//cdn.datatables.net/tabletools/2.2.3/css/dataTables.tableTools.css" rel="stylesheet" type="text/css" />
        <link href="//cdn.datatables.net/plug-ins/725b2a2115b/integration/bootstrap/3/dataTables.bootstrap.css" rel="stylesheet" type="text/css" />
        <link href="//editor.datatables.net/examples/resources/bootstrap/editor.bootstrap.css" rel="stylesheet" type="text/css" />

        <!-- Date Picker -->
        <link href="css/datepicker/datepicker3.css" rel="stylesheet" type="text/css" />
        <!-- Daterange picker -->
        <link href="css/daterangepicker/daterangepicker-bs3.css" rel="stylesheet" type="text/css" />
        <!-- Ionicons -->
        <link href="//code.ionicframework.com/ionicons/1.5.2/css/ionicons.min.css" rel="stylesheet" type="text/css" />
        <!-- Theme style -->
        <link href="css/AdminLTE.css" rel="stylesheet" type="text/css" />
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>

        <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
          <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
        <![endif]-->
	<style>		 
		.table {margin:0 auto; border-collapse:separate;}
	</style>
    </head>    
    <body class="skin-blue">

          <header class="header">
            <a href="index.php" class="logo">
                Biocore - Test Case
            </a>
            <!-- Header Navbar: style can be found in header.less -->
            <nav class="navbar navbar-static-top" role="navigation">
                <div class="navbar-right">
                </div>
            </nav>
        </header>
  
         <div class="wrapper row-offcanvas row-offcanvas-left">
			<!-- Left side column. contains the logo and sidebar -->
            <aside class="left-side sidebar-offcanvas">
                <!-- sidebar: style can be found in sidebar.less -->
                <section class="sidebar">
                                        <!-- Sidebar user panel -->
                    <div class="user-panel">
                        <div class="pull-left image">
                            <img src="https://dolphin.umassmed.edu/public/img/avatar5.png" class="img-circle" alt="User Image" />
                        </div>
                        <div class="pull-left info">
                            <p>Hello, Test User</p>

                            <a href="#"><i class="fa fa-circle text-success"></i> Online</a>
                        </div>
                    </div>
                    
                    <!-- search form -->
                    <form action="#" method="get" class="sidebar-form">
                        <div class="input-group">
                            <input type="text" name="q" class="form-control" placeholder="Search..."/>
                            <span class="input-group-btn">
                                <button type='submit' name='search' id='search-btn' class="btn btn-flat"><i class="fa fa-search"></i></button>
                            </span>
                        </div>
                    </form>
                    <!-- /.search form -->
                    <!-- sidebar menu: : style can be found in sidebar.less -->
                    <ul class="sidebar-menu">
<li><a href="index.php?np=1"><i class="fa fa-dashboard"></i><span>Parameters</span></a></li>
<li><a href="index.php?np=2"><i class="fa fa-bar-chart-o"></i><span>Processes</span></a></li>
<li><a href="index.php?np=3"><i class="fa fa-laptop"></i><span>Pipelines</span></a></li>
<li><a href="index.php?np=4"><i class="fa fa-laptop"></i><span>New Params</span></a></li>
<li><a href="index.php?np=5"><i class="fa fa-laptop"></i><span>New Pipelines</span></a></li><ul>

<?php
include("php/funcs.php");
//$np = $_REQUEST['np'];
$np = isset($_REQUEST["np"]) ? $_REQUEST["np"] : "";
?>
<!-- /.sidebar -->
            </aside>
            <aside class="right-side">
		<!-- Content Header (Page header) -->
                <section class="content-header">
                    <h1>
                        Biocore Pipeline Generation
                        <small><?php print getTitle($np); ?></small>
                    </h1>
                    <ol class="breadcrumb">
                        <li><a href=""><i class="fa fa-dashboard"></i> Home</a></li>
                        <li><a href=""></a>NGS Pipeline</li>
                        <li class="active"><?php print getTitle($np); ?></li>
                    </ol>
                </section>

         <!-- Main content -->
         <section class="content">
             <div class="row">
                              <div class="box">
                                <div class="box-header">
                                   <h3 class="box-title"><?php print getTitle($np); ?></h3>
                               </div><!-- /.box-header -->
                               <div class="box-body table-responsive" style="overflow-y:scroll;">
                               <?php print getPage($np); ?>
                               </div><!-- /.box-body -->
                            </div><!-- /.box -->
               </div><!-- /.row -->
        </section><!-- /.content -->

        </aside><!-- /.right-side -->
        </div><!-- ./wrapper -->
        
		<!-- Modal -->
		
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
        <script src="https://cdn.datatables.net/1.10.13/js/jquery.dataTables.min.js"></script>
        <script src="https://cdn.datatables.net/1.10.13/js/dataTables.bootstrap.min.js"></script>
			
        <?php print getJS($np); ?>
   </body>

</html>
