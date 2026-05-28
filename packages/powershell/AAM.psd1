# AAM PowerShell Module Manifest
@{
    ModuleVersion = '1.0.2'
    GUID          = 'a5f27c3e-f1b2-4d56-bc92-3a8309a473ee'
    Author        = 'Naresh B A'
    Description   = 'Living cognitive architecture maps for AI coding assistants (PowerShell Module Wrapper).'
    
    # Minimum PowerShell version
    PowerShellVersion = '5.1'

    # Script module file
    RootModule = 'AAM.psm1'

    # Cmdlets to export
    CmdletsToExport = @('Initialize-AAM', 'Test-AAM', 'Start-AAMViewer')
}
