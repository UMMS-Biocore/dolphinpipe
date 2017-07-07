<div class="row">
                <div class="col-md-3">
                    <button type="button" class="btn btn-primary btn-sm btn-block" title="Add Pipeline" id="addpipeline" data-toggle="modal" data-target="#pipelinemodal">Add Pipeline</button>
                    <div class="list-group" id="pipelinelist"></div>
                </div>
                <div class="col-md-9">
                    <div class="panel panel-default" id="cypanel" style="display:none">
                        <div class="panel-heading clearfix">
                            <div class="pull-right">
                                <div class="btn-group" role="group">
                                    <button type="button" class="btn btn-primary btn-sm" title="Remove Pipeline" id="removepipeline">Remove Pipeline</button>
                                    <button type="button" class="btn btn-primary btn-sm" title="Create Pipeline" id="createnextflow">Create Nextflow</button>
                                </div>
                            </div>
                            <div class="pull-left">
                                <h3 class="panel-title" id="cypaneltitle">Pipeline 1</h3>
                            </div>
                        </div>
                        <div class="panel-body">
                            <div class="container-fluid">
                                <div id="cy"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="pipelinemodal" class="modal fade" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title" id="pipelinemodaltitle">Modal title</h4>
                        </div>
                        <div class="modal-body">
                            <form class="form-horizontal">
                                <div class="form-group" style="display:none">
                                    <label for="mID" class="col-sm-2 control-label">ID</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" id="mID" name="id">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="mName" class="col-sm-2 control-label">Name</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" id="mName" name="name">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="mVersion" class="col-sm-2 control-label">Version</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" id="mVersion" name="version">
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" id="savepipeline" data-clickedrow="">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="pipelineprocessmodal" class="modal fade" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title" id="pipelineprocessmodaltitle">Modal title</h4>
                        </div>
                        <div class="modal-body">
                            <form class="form-horizontal">
                                <div class="form-group" style="display:none">
                                    <label for="mppID" class="col-sm-2 control-label" >ID</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" id="mppID" name="id">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="mppName" class="col-sm-2 control-label">Name</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" id="mppName" name="name">
                                    </div>
                                </div>
                                <div class="form-group" style="display:none">
                                    <label for="mppPipeline" class="col-sm-2 control-label">Pipeline ID</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" id="mppPipeline" name="pipeline_id">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="mppProcess" class="col-sm-2 control-label">Process</label>
                                    <div class="col-sm-10">
                                        <select class="form-control" id="mppProcess" name="process_id">  
                                        </select>
                                    </div>
                                </div>
								<table class="table" style="width:100%" id="static_field">
								  <tr>
									<th style="width:30%">Process Inputs</th>
									<th style="width:40%">Available Parameters</th>
									<th style="width:30%">Matching Name</th>
									</tr>								
								</table>
								<table class="table" style="width:100%" id="dynamic_field">
								  							
								</table>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" id="savepipelineprocess" data-clickedrow="">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>