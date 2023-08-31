using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace cadastro_livro
{
    public partial class Form6 : Form
    {
        public string sql = "";

        MySqlConnection con = new MySqlConnection("server=localhost; database=distribuidora; user id=root; password=root; port=3310;");
        MySqlDataReader reader;

        public Form6()
        {
            InitializeComponent();
        }

        private void buton_login_Click(object sender, EventArgs e)
        {
            Form1 novaform = new Form1(con, reader);
            novaform.ShowDialog();
        }
    }
}
