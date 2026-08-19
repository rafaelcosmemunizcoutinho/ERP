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
    public partial class crud_cliente : Form
    {
        MySqlConnection con;
        MySqlDataReader reader;
        private string status, sql = "";
        private int ativo = 0;

        public crud_cliente(MySqlConnection con, MySqlDataReader reader)
        {
            InitializeComponent();

            this.con = con;
            this.reader = reader;


            listViewCli.LabelEdit = true;
            listViewCli.AllowColumnReorder = true;
            listViewCli.FullRowSelect = true;
            listViewCli.GridLines = true;
        }

        private void clientes_desativados_CheckedChanged(object sender, EventArgs e)
        {
            try
            {
                if (cliente_inativo.Checked == true)
                {
                    status = "Inativo";
                    sql = "SELECT pk_id, nome, apelido, valor_divida, celular FROM distribuidora.cliente WHERE ativo = " + 0 + " ORDER BY nome ASC";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Cliente = anonimo");
            }
        }

        private void btnBuscaCli_Click(object sender, EventArgs e)
        {
            try
            {
                listViewCli.Items.Clear();
                buttonReset_Click(sender, e);

                if (cliente_inativo.Checked == false)
                {
                    status = "Ativo";
                    sql = "SELECT pk_id, nome, apelido, valor_divida, celular FROM distribuidora.cliente WHERE nome LIKE'" + textNomeCli.Text + "%' AND ativo = " + 1 + " ORDER BY nome ASC";
                }
                else
                {
                    status = "Inativo";
                    sql = "SELECT pk_id, nome, apelido, valor_divida, celular FROM distribuidora.cliente WHERE nome LIKE'" + textNomeCli.Text + "%' AND ativo = " + 0 + " ORDER BY nome ASC";
                }

                MySqlCommand comando = new MySqlCommand(sql, con);

                reader = comando.ExecuteReader();

                while (reader.Read())
                {
                    ListViewItem list = new ListViewItem(reader[0].ToString());
                    list.SubItems.Add(reader[1].ToString());
                    list.SubItems.Add(reader[2].ToString());
                    list.SubItems.Add(reader[3].ToString());
                    list.SubItems.Add(reader[4].ToString());

                    listViewCli.Items.AddRange(new ListViewItem[] { list });
                }

                reader.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Listagem de clientes completa!");
            }
        }

        private void buttonReset_Click(object sender, EventArgs e)
        {
            try
            {
                textIdCli.Text = "";
                textNomeCliente.Text = "";
                textApelidoCliente.Text = "";
                textCelCli.Text = "";
                textDivCli.Text = "";
                comboStatusCli.Text = "Select";
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Campos limpos com sucesso!");
            }
        }

        private void buttonRegCli_Click(object sender, EventArgs e)
        {
            try
            {
                if (textNomeCliente.Text == "" || textApelidoCliente.Text == "" || textCelCli.Text == "" || textDivCli.Text == "")
                    MessageBox.Show("Preencha o(s) campo(s)!", "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);

                else
                {
                    if (textIdCli.Text == "")
                    {
                        sql = "INSERT INTO distribuidora.cliente(nome, apelido, celular, data_cadastro, valor_divida, ativo)" +
                                    "VALUES('" + textNomeCliente.Text + "'," +
                                    " '" + textApelidoCliente.Text + "'," +
                                    " '" + textCelCli.Text + "'," +
                                    " '" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "'," +
                                    " '" + float.Parse(textDivCli.Text) + "'," +
                                    " '" + 1 + "')";
                    }
                    else
                    {
                        sql = "UPDATE distribuidora.cliente SET nome = '" + textNomeCliente.Text + "', " +
                            "apelido = '" + textApelidoCliente.Text + "'," +
                            "celular = '" + textCelCli.Text + "'," +
                            "updated_at = '" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "'," +
                            "valor_divida = '" + float.Parse(textDivCli.Text) + "'," +
                            "ativo = '" + ativo + "' WHERE pk_id = " + textIdCli.Text +" ";
                    }
                    MySqlCommand comand = new MySqlCommand(sql, con);

                    reader = comand.ExecuteReader();

                    if (reader != null)
                    {
                        MessageBox.Show("Registro Salvo!", "Information", MessageBoxButtons.OK, MessageBoxIcon.Information);

                        reader.Close();

                        btnBuscaCli_Click(sender, e);
                    }

                    reader.Close();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
        }

        private void buttonDelCli_Click(object sender, EventArgs e)
        {
            try
            {
                if (listViewCli.SelectedItems.Count == 0)
                {
                    MessageBox.Show("Selecione o Cliente a ser Deletado!", "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
                else
                {
                    sql = "UPDATE distribuidora.cliente SET updated_at = '" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "'," +
                                "ativo = '" + 0 + "' WHERE pk_id = " + textIdCli.Text + " ";

                    MySqlCommand comand = new MySqlCommand(sql, con);

                    reader = comand.ExecuteReader();

                    if (reader != null)
                    {
                        MessageBox.Show("Cliente Inativado!", "Information", MessageBoxButtons.OK, MessageBoxIcon.Information);

                        reader.Close();

                        btnBuscaCli_Click(sender, e);
                    }

                    reader.Close();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Cliente desativado com sucesso!");
            }
        }

        private void comboStatusCli_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (comboStatusCli.Text == "Inativo")
                ativo = 0;
            else
                ativo = 1;
        }

        private void listViewCli_click(object sender, EventArgs e)
        {
            try
            {
                textIdCli.Text = listViewCli.Items[listViewCli.FocusedItem.Index].SubItems[0].Text;
                textNomeCliente.Text = listViewCli.Items[listViewCli.FocusedItem.Index].SubItems[1].Text;
                textApelidoCliente.Text = listViewCli.Items[listViewCli.FocusedItem.Index].SubItems[2].Text;
                textDivCli.Text = listViewCli.Items[listViewCli.FocusedItem.Index].SubItems[3].Text;
                textCelCli.Text = listViewCli.Items[listViewCli.FocusedItem.Index].SubItems[4].Text;
                
                comboStatusCli.Text = status;

                if(comboStatusCli.Text == "Inativo")
                {
                    ativo = 0;
                    comboStatusCli.Enabled = true;
                }
                else
                {
                    ativo = 1;
                    comboStatusCli.Enabled = false;
                }
                    
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Cliente carregado com sucesso!");
            }
            
        }
    }
}
