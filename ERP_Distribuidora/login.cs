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
    public partial class login : Form
    {
        public string sql = "";

        MySqlConnection con = new MySqlConnection("server=localhost; database=distribuidora; user id=root; password=root; port=3310;");
        MySqlDataReader reader;

        public login()
        {
            InitializeComponent();
        }

        private void buton_login_Click(object sender, EventArgs e)
        {
            Inicio novaform = new Inicio(con, reader);
            novaform.ShowDialog();
        }
    }
}
