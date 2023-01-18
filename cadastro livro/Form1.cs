namespace cadastro_livro
{
    using System;
    using System.ComponentModel;
    using System.Windows.Forms;
    using MySql.Data.MySqlClient;

    public partial class Form1 : Form
    {
        public string sql = "";
        public int ativo;
        MySqlConnection con;
        MySqlDataReader reader;

        public Form1(MySqlConnection con, MySqlDataReader reader)
        {
            this.con = con;
            this.reader = reader;

            InitializeComponent();

            listView1.LabelEdit = true;
            listView1.AllowColumnReorder = true;
            listView1.FullRowSelect = true;
            listView1.GridLines = true;

            try
            {
                con.Open();

                //MessageBox.Show("Conectou!");
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
            }

        }
        void carregaVars(object sender, EventArgs e)
        {
            try
            {
                listView1.Items.Clear();

                if (checkBoxAtivo.Checked)
                    ativo = 1;
                else
                    ativo = 0;

                if (textBusca.Text != "")
                    sql = "SELECT pk_id, nome, categoria, tamanho, preco_compra, preco_venda, qtd_estoque, ativo FROM distribuidora.produto WHERE nome LIKE'" + textBusca.Text + "%' AND ativo = '" + ativo + "' ORDER BY nome ASC";

                else
                    sql = "SELECT pk_id, nome, categoria, tamanho, preco_compra, preco_venda, qtd_estoque, ativo FROM distribuidora.produto WHERE ativo = '" + ativo + "' ORDER BY nome ASC";

                MySqlCommand comando = new MySqlCommand(sql, con);

                reader = comando.ExecuteReader();

                while (reader.Read())
                {
                    ListViewItem list = new ListViewItem(reader[0].ToString());
                    list.SubItems.Add(reader[1].ToString());
                    list.SubItems.Add(reader[2].ToString());
                    list.SubItems.Add(reader[3].ToString());
                    list.SubItems.Add(reader[4].ToString());
                    list.SubItems.Add(reader[5].ToString());
                    list.SubItems.Add(reader[6].ToString());
                    list.SubItems.Add(reader[7].ToString());
                    listView1.Items.AddRange(new ListViewItem[] { list });
                }

                reader.Close();

                if (listView1.Items.Count == 0)
                {
                    btnLimpar_Click(sender, e);
                    MessageBox.Show("Não encontrado!", "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Produto(s) Carregados com sucesso!");
            }
        }
        private void btnSalvar_Click(object sender, EventArgs e)
        {

            try
            {
                if (textName.Text == "" || comboTipo.Text == "" || textPreC.Text == "" || textPreV.Text == "" || comboTam.Text == "" || textQtd.Text == "")
                    MessageBox.Show("Informe o(s) campos do produto.", "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);

                else
                {
                    if (comboStatus.Text == "Ativo")
                    {
                        comboStatus.Enabled = false;
                        ativo = 1;
                    }

                    if (textId.Text == "")
                    {
                        sql = "INSERT INTO distribuidora.produto(created, nome, categoria, tamanho, preco_venda, preco_compra, qtd_estoque, ativo)" +
                            "VALUES('" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "', '" + textName.Text + "', '" + comboTipo.Text + "', '" + comboTam.Text + "', '" + textPreV.Text + "', '" + textPreC.Text + "', '" + textQtd.Text + "', '" + ativo + "')";

                        MySqlCommand comando = new MySqlCommand(sql, con);

                        reader = comando.ExecuteReader();

                        if (reader != null)
                        {
                            MessageBox.Show("Produto Salvo com sucesso!", "Information", MessageBoxButtons.OK, MessageBoxIcon.Information);

                            textBusca.Text = textName.Text;
                        }
                        reader.Close();
                    }
                    else
                    {
                        if (comboStatus.Text == "Inativo")
                            ativo = 0;
                        else
                            ativo = 1;

                        sql = "UPDATE distribuidora.produto SET nome='" + textName.Text + "'," +
                            "updated = '" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "'," +
                            "categoria = '" + comboTipo.Text + "'," +
                            "preco_venda = '" + textPreV.Text + "'," +
                            "preco_compra = '" + textPreC.Text + "'," +
                            "tamanho = '" + comboTam.Text + "'," +
                            "ativo = '" + ativo + "'," +
                            "qtd_estoque = '" + textQtd.Text + "'" +

                            "WHERE distribuidora.produto.pk_id = '" + textId.Text + "'";

                        MySqlCommand comando = new MySqlCommand(sql, con);

                        reader = comando.ExecuteReader();

                        if (reader != null)
                        {
                            MessageBox.Show("Registro atualizado com sucesso.", "Atualizar", MessageBoxButtons.OK, MessageBoxIcon.Information);
                            textBusca.Text = textName.Text;
                        }
                        reader.Close();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Produto Salvo com sucesso!");
                btnLimpar.PerformClick();
                carregaVars(sender, e);
            }
        }
        private void btnBuscar_Click(object sender, EventArgs e)
        {
            carregaVars(sender, e);
        }
        private void listView1_Click(object sender, EventArgs e)
        {
            try
            {
                textId.Text = listView1.Items[listView1.FocusedItem.Index].SubItems[0].Text;
                textName.Text = listView1.Items[listView1.FocusedItem.Index].SubItems[1].Text;
                comboTipo.Text = listView1.Items[listView1.FocusedItem.Index].SubItems[2].Text;
                comboTam.Text = listView1.Items[listView1.FocusedItem.Index].SubItems[3].Text;
                textPreC.Text = listView1.Items[listView1.FocusedItem.Index].SubItems[4].Text;
                textPreV.Text = listView1.Items[listView1.FocusedItem.Index].SubItems[5].Text;
                textQtd.Text = listView1.Items[listView1.FocusedItem.Index].SubItems[6].Text;


                if (listView1.Items[listView1.FocusedItem.Index].SubItems[7].Text == "True")
                {
                    comboStatus.Text = "Ativo";
                    comboStatus.Enabled = false;
                    btnDeletar.Enabled = true;
                }
                else
                {
                    comboStatus.Text = "Inativo";
                    comboStatus.Enabled = true;
                    btnDeletar.Enabled = false;
                }
                reader.Close();

            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Produtos listados com sucesso!");
            }
        }
        private void btnDeletar_Click(object sender, System.EventArgs e)
        {
            try
            {
                if (textId != null)
                {
                    if (MessageBox.Show("Deseja excluir o programa?", "Delete", MessageBoxButtons.YesNo,
                    MessageBoxIcon.Question) == DialogResult.Yes)
                    {
                        //sql = "DELETE FROM catalogo.produtos WHERE id='" + listView1.Items[listView1.FocusedItem.Index].SubItems[0].Text + "'";
                        sql = "UPDATE distribuidora.produto " +
                                "SET " +
                                "deleted ='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "'," +
                                "ativo = '0'" +                                
                                
                                "WHERE distribuidora.produto.pk_id = '" + textId.Text + "'";

                        MySqlCommand comando = new MySqlCommand(sql, con);

                        reader = comando.ExecuteReader();

                        if (reader != null)
                            MessageBox.Show("Produto Deletado com Sucesso!", "Information", MessageBoxButtons.OK, MessageBoxIcon.Information);

                        reader.Close();

                        btnLimpar.PerformClick();
                        
                    }
                }
                else
                {
                    MessageBox.Show("Não há produto selecionado para ser deletado", "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Produto deletado com sucesso!");
                carregaVars(sender, e);
            }
            
        }
        private void btnLimpar_Click(object sender, EventArgs e)
        {
            try
            {
                textName.Text = "";
                comboTipo.Text = "Select";
                textPreC.Text = "";
                textPreV.Text = "";
                comboTam.Text = "Select";
                textQtd.Text = "";
                textId.Text = "";
                comboStatus.Text = "Select";
                comboStatus.BackColor = SystemColors.Window;
                btnDeletar.Enabled = false;
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
        private void btnRegistraVenda_Click_1(object sender, EventArgs e)
        {
            Form2 novaform = new Form2(con, reader);
            novaform.ShowDialog();
        }

        private void buttonComp_Click(object sender, EventArgs e)
        {
            Form3 novaform = new Form3(con, reader);
            novaform.ShowDialog();
        }

        private void buttonCli_Click(object sender, EventArgs e)
        {
            Form5 novaform = new Form5(con, reader);
            novaform.ShowDialog();
        }

        private void buttonFornecedor_Click(object sender, EventArgs e)
        {
            Form4 novaform = new Form4(con, reader);
            novaform.ShowDialog();
        }
    }
}

        