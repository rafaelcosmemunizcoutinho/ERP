using System;
using MySql.Data.MySqlClient;
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
    public partial class Form4 : Form
    {
        MySqlConnection con;
        MySqlDataReader reader;
        private string status, sql = "";
        private int ativo = 0;

        public Form4(MySqlConnection con, MySqlDataReader reader)
        {
            InitializeComponent();

            this.con = con;
            this.reader = reader;


            listViewFor.LabelEdit = true;
            listViewFor.AllowColumnReorder = true;
            listViewFor.FullRowSelect = true;
            listViewFor.GridLines = true;
        }

        private void btnBuscaFor_Click(object sender, EventArgs e)
        {
            try
            {
                buttonReset_Click(sender, e);
                listViewFor.Items.Clear();

                if (fornecedor_inativo.Checked == false)
                {
                    status = "Ativo";
                    sql = "SELECT pk_id, nome, representante, divida, celular FROM distribuidora.fornecedor WHERE nome LIKE'" + textNomeForBusca.Text + "%' AND ativo = " + 1 + " ORDER BY nome ASC";
                }
                else
                {
                    status = "Inativo";
                    sql = "SELECT pk_id, nome, representante, divida, celular FROM distribuidora.fornecedor WHERE nome LIKE'" + textNomeForBusca.Text + "%' AND ativo = " + 0 + " ORDER BY nome ASC";
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

                    listViewFor.Items.AddRange(new ListViewItem[] { list });
                }

                reader.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Listagem de fornecedores completa!");
            }

        }

        private void buttonReset_Click(object sender, EventArgs e)
        {
            try
            {
                textIdFor.Text = "";
                textNomeFor.Text = "";
                textRepreFor.Text = "";
                textCelFor.Text = "";
                textDivFor.Text = "";
                comboStatusFor.Text = "Select";
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

        private void buttonRegFor_Click(object sender, EventArgs e)
        {
            try
            {
                if (textNomeFor.Text == "" || textRepreFor.Text == "" || textCelFor.Text == "" || textDivFor.Text == "")
                    MessageBox.Show("Preencha o(s) campo(s)!", "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);

                else
                {
                    if (textIdFor.Text == "")
                    {
                        sql = "INSERT INTO distribuidora.fornecedor(nome, representante, celular, created_at, divida, ativo)" +
                                    "VALUES('" + textNomeFor.Text + "'," +
                                    " '" + textRepreFor.Text + "'," +
                                    " '" + textCelFor.Text + "'," +
                                    " '" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "'," +
                                    " '" + float.Parse(textDivFor.Text) + "'," +
                                    " '" + 1 + "')";
                    }
                    else
                    {
                        sql = "UPDATE distribuidora.fornecedor SET nome = '" + textNomeFor.Text + "', " +
                            "representante = '" + textRepreFor.Text + "'," +
                            "celular = '" + textCelFor.Text + "'," +
                            "updated_at = '" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "'," +
                            "divida = '" + float.Parse(textDivFor.Text) + "'," +
                            "ativo = '" + ativo + "' WHERE pk_id = " + textIdFor.Text + " ";
                    }
                    MySqlCommand comand = new MySqlCommand(sql, con);

                    reader = comand.ExecuteReader();

                    if (reader != null)
                    {
                        MessageBox.Show("Registro Salvo!", "Information", MessageBoxButtons.OK, MessageBoxIcon.Information);

                        reader.Close();

                        btnBuscaFor_Click(sender, e);
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
                buttonReset_Click(sender, e);
            }
        }

        private void buttonDelFor_Click(object sender, EventArgs e)
        {
            try
            {
                if (listViewFor.SelectedItems.Count == 0)
                {
                    MessageBox.Show("Selecione o Fornecedor a ser Desativado!", "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
                else
                {
                    sql = "UPDATE distribuidora.fornecedor SET updated_at = '" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "'," +
                                "ativo = '" + 0 + "' WHERE pk_id = " + textIdFor.Text + " ";

                    MySqlCommand comand = new MySqlCommand(sql, con);

                    reader = comand.ExecuteReader();

                    if (reader != null)
                    {
                        MessageBox.Show("Fornecedor Inativado!", "Information", MessageBoxButtons.OK, MessageBoxIcon.Information);

                        reader.Close();

                        btnBuscaFor_Click(sender, e);
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
                buttonReset_Click(sender, e);
            }
        }

        private void comboStatusFor_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (comboStatusFor.Text == "Inativo")
                ativo = 0;
            else
                ativo = 1;
        }

        private void cliente_inativo_CheckedChanged(object sender, EventArgs e)
        {
            try
            {
                if (fornecedor_inativo.Checked == true)
                {
                    status = "Inativo";
                    sql = "SELECT pk_id, nome, representante, divida, celular FROM distribuidora.fornecedor WHERE ativo = " + 0 + " ORDER BY nome ASC";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Fornecedor = anonimo");
            }
        }

        private void listViewFor_click(object sender, EventArgs e)
        {
            try
            {
                textIdFor.Text = listViewFor.Items[listViewFor.FocusedItem.Index].SubItems[0].Text;
                textNomeFor.Text = listViewFor.Items[listViewFor.FocusedItem.Index].SubItems[1].Text;
                textRepreFor.Text = listViewFor.Items[listViewFor.FocusedItem.Index].SubItems[2].Text;
                textDivFor.Text = listViewFor.Items[listViewFor.FocusedItem.Index].SubItems[3].Text;
                textCelFor.Text = listViewFor.Items[listViewFor.FocusedItem.Index].SubItems[4].Text;

                comboStatusFor.Text = status;

                if (comboStatusFor.Text == "Inativo")
                {
                    ativo = 0;
                    comboStatusFor.Enabled = true;
                }
                else
                {
                    ativo = 1;
                    comboStatusFor.Enabled = false;
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Fornecedor carregado com sucesso!");
            }

        }
    }
}
