namespace Telia.NTW.OMT.ViewModels
{
    public class TeliaTextFieldViewModel
    {
        public string Text { get; set; }
        public bool Full { get; set; }
        public bool Disabled { get; set; }

        public TeliaTextFieldViewModel(string text, bool full)
        {
            this.Text = text;
            this.Full = full;
            Disabled = false;
        }
    }
}