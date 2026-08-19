using MySql.Data.MySqlClient;

namespace cadastro_livro
{
    public partial class realiza_venda : Form
    {
        public string sql = "";
        public float preco_venda = 0;
        MySqlConnection con;
        MySqlDataReader reader;


        public realiza_venda(MySqlConnection con, MySqlDataReader reader)
        {
            this.con = con;
            this.reader = reader;

            InitializeComponent();

            listViewProdVenda.LabelEdit = true;
            listViewProdVenda.AllowColumnReorder = true;
            listViewProdVenda.FullRowSelect = true;
            listViewProdVenda.GridLines = true;

            listViewCliVenda.LabelEdit = true;
            listViewCliVenda.AllowColumnReorder = true;
            listViewCliVenda.FullRowSelect = true;
            listViewCliVenda.GridLines = true;

            listViewProdAddVenda.LabelEdit = true;
            listViewProdAddVenda.AllowColumnReorder = true;
            listViewProdAddVenda.FullRowSelect = true;
            listViewProdAddVenda.GridLines = true;

            carregaVarsProd(con, reader);
            carregaVarsCli(con, reader);
        }
        internal static void ActiveForm(Form activeForm)
        {
            throw new NotImplementedException();
        }
        private void carregaVarsProd(MySqlConnection con, MySqlDataReader reader)
        {
            try
            {
                if (textBuscaProd.Text != "")
                    sql = "SELECT pk_id, nome, categoria, tamanho, preco_venda, qtd_estoque FROM distribuidora.produto WHERE nome LIKE'" + textBuscaProd.Text + "%' AND ativo = '1' ORDER BY nome ASC";
                
                else
                    sql = "SELECT pk_id, nome, categoria, tamanho, preco_venda, qtd_estoque FROM distribuidora.produto WHERE ativo = '1' ORDER BY nome ASC";

                listViewProdVenda.Items.Clear();

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

                    listViewProdVenda.Items.AddRange(new ListViewItem[] { list });
                }

                reader.Close();
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
        private void carregaVarsCli(MySqlConnection con, MySqlDataReader reader)
        {
            try
            {
                listViewCliVenda.Items.Clear();

                sql = "SELECT pk_id, nome, apelido, valor_divida FROM distribuidora.cliente WHERE nome != 'anonimo' ORDER BY pk_id ASC";

                MySqlCommand comando = new MySqlCommand(sql, con);

                reader = comando.ExecuteReader();

                while (reader.Read())
                {
                    ListViewItem list = new ListViewItem(reader[0].ToString());
                    list.SubItems.Add(reader[1].ToString());
                    list.SubItems.Add(reader[2].ToString());
                    list.SubItems.Add(reader[3].ToString());

                    listViewCliVenda.Items.AddRange(new ListViewItem[] { list });
                }

                reader.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Cliente(s) Carregados com sucesso!");
            }
        }
        private void listViewProdVenda_Click(object sender, EventArgs e)
        {
            try
            {
                quantProdVenda.Enabled = true;
                btnAddProdVenda.Enabled=true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Produto Selecionado com sucesso!");
            }
        }
        private void listViewCliVenda_Click(object sender, EventArgs e)
        {
            try
            {
                textCliente.Text = listViewCliVenda.Items[listViewCliVenda.FocusedItem.Index].SubItems[1].Text;
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Cliente Selecionado com sucesso!");
            }
        }
        private void listViewProdAddVenda_Click(object sender, EventArgs e)
        {
            try
            {
                if(btnRemovProdVenda.Enabled == false)
                    btnRemovProdVenda.Enabled = true;
                
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Venda Selecionada com sucesso!");
            }
        }
        private void btnLimparVenda_Click(object sender, EventArgs e)
        {
            try
            {
                textCliente.Text = "";
                comboTipoVenda.Text = "Select";
                comboDesconto.Text = "Select";
                textPrecoProdutos.Text = "";
                textPrecoVenda.Text = "";
                textNomeCliente.Text = "";
                cliente_anonimo.Checked = false;
                btnRemovProdVenda.Enabled = false;
                btnAddProdVenda.Enabled = false;
                quantProdVenda.Enabled=false;
                btnRemovProdVenda.Enabled = false;
                comboDesconto.Enabled = false;
                comboTipoVenda.Enabled = false;
                quantProdVenda.Value = 0;

                listViewProdAddVenda.Items.Clear();
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
        private void cliente_anonimo_CheckedChanged(object sender, EventArgs e)
        {
            try
            {
                if (cliente_anonimo.Checked == true)
                {
                    textCliente.Text = "Sem Cadastro";
                    listViewCliVenda.Enabled = false;
                }
                else
                {
                    textCliente.Text = "";
                    listViewCliVenda.Enabled = true;
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
        private void btnRemovProdVenda_Click(object sender, EventArgs e)
        {
            atualizaPrecoVenda("subtrai");
        }
        private void atualizaPrecoVenda(string operacao)
        {
            try
            {
                if (operacao == "soma")
                {
                    preco_venda += (float)(Convert.ToDouble(quantProdVenda.Value) * float.Parse(listViewProdVenda.Items[listViewProdVenda.FocusedItem.Index].SubItems[4].Text));

                    textPrecoProdutos.Text = "R$ " + preco_venda.ToString();

                    Console.WriteLine(listViewProdVenda.Items[listViewProdVenda.FocusedItem.Index].SubItems[3].Text +" X " + listViewProdVenda.Items[listViewProdVenda.FocusedItem.Index].SubItems[1].Text + " Adicionado ao carrinho!");
                }
                else if(operacao == "subtrai")
                {
                    preco_venda -= float.Parse(listViewProdAddVenda.Items[listViewProdAddVenda.FocusedItem.Index].SubItems[5].Text);
                    textPrecoProdutos.Text = "R$ " + preco_venda.ToString();

                    listViewProdAddVenda.Items.RemoveAt(listViewProdAddVenda.FocusedItem.Index);

                    Console.WriteLine(listViewProdVenda.Items[listViewProdVenda.FocusedItem.Index].SubItems[3].Text + " X " + listViewProdVenda.Items[listViewProdVenda.FocusedItem.Index].SubItems[1].Text + " Removido do carrinho!");
                }

                if (listViewProdAddVenda.Items.Count == 0)
                    btnRemovProdVenda.Enabled = false;
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
        }
        private void btnAddProdVenda_Click(object sender, EventArgs e)
        {
            try
            {
                if(comboDesconto.Enabled == false && comboTipoVenda.Enabled == false)
                {
                    comboDesconto.Enabled = true;
                    comboTipoVenda.Enabled = true;
                }

                if (listViewProdAddVenda.Items.Count == 0)
                    listViewProdAddVenda.Items.Clear();

                if (quantProdVenda.Value > 0 )
                {
                    ListViewItem list = new ListViewItem(listViewProdVenda.Items[listViewProdVenda.FocusedItem.Index].SubItems[0].Text);
                    list.SubItems.Add(listViewProdVenda.Items[listViewProdVenda.FocusedItem.Index].SubItems[1].Text);
                    list.SubItems.Add(listViewProdVenda.Items[listViewProdVenda.FocusedItem.Index].SubItems[2].Text);
                    list.SubItems.Add(listViewProdVenda.Items[listViewProdVenda.FocusedItem.Index].SubItems[3].Text);
                    list.SubItems.Add(quantProdVenda.Value.ToString());
                    list.SubItems.Add(((float)(Convert.ToDouble(quantProdVenda.Value) * float.Parse(listViewProdVenda.Items[listViewProdVenda.FocusedItem.Index].SubItems[4].Text))).ToString());

                    listViewProdAddVenda.Items.AddRange(new ListViewItem[] { list });
                    
                    atualizaPrecoVenda("soma");

                    quantProdVenda.Value = 0;
                }
                else
                {
                    MessageBox.Show("Selecione a Quantidade!", "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Produto " + listViewProdVenda.Items[listViewProdVenda.FocusedItem.Index].SubItems[1].Text + "adicionado ao carrinho!");
            }

        }
        private void btnRegistraVenda_Click(object sender, EventArgs e)
        {
            try
            {
                if (textCliente.Text == "" || comboTipoVenda.Text == "Select" || comboDesconto.Text == "Select")
                    MessageBox.Show("Selecione o Cliente e(ou) o Tipo da Venda e(ou) Desconto", "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);

                else if (listViewProdAddVenda.Items.Count == 0)
                {
                    MessageBox.Show("Selecione Produto(s) para a Venda", "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
                else
                {

                    for(int i = 0; i < listViewProdAddVenda.Items.Count; i++)
                    {
                        if (cliente_anonimo.Checked)
                        {
                            sql = "INSERT INTO distribuidora.venda(fk_cliente, fk_produto, quantidade, valor, tipo, data_venda)" +
                                "VALUES('" + 1 + "'," +
                                " '" + int.Parse(listViewProdAddVenda.Items[i].SubItems[0].Text) + "'," +
                                " '" + int.Parse(listViewProdAddVenda.Items[i].SubItems[4].Text) + "'," +
                                " '" + float.Parse(listViewProdAddVenda.Items[i].SubItems[5].Text) + "'," +
                                " '" + comboTipoVenda.Text + "'," +
                                " '" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "')";
                        }
                        else
                        {
                            sql = "INSERT INTO distribuidora.venda(fk_cliente, fk_produto, quantidade, valor, tipo, data_venda)" +
                                "VALUES('" + int.Parse(listViewCliVenda.Items[listViewCliVenda.FocusedItem.Index].SubItems[0].Text) + "'," +
                                " '" + int.Parse(listViewProdAddVenda.Items[i].SubItems[0].Text) + "'," +
                                " '" + int.Parse(listViewProdAddVenda.Items[i].SubItems[4].Text) + "'," +
                                " '" + float.Parse(listViewProdAddVenda.Items[i].SubItems[5].Text) + "'," +
                                " '" + comboTipoVenda.Text + "'," +
                                " '" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "')";
                            
                        }
                        MySqlCommand comand = new MySqlCommand(sql, con);

                        reader = comand.ExecuteReader();

                        reader.Close();
                    }

                    for (int i = 0; i < listViewProdAddVenda.Items.Count; i++)
                    {
                        sql = "UPDATE distribuidora.produto SET qtd_estoque = qtd_estoque - '" + int.Parse(listViewProdAddVenda.Items[i].SubItems[4].Text) + "'" +
                                "WHERE distribuidora.produto.pk_id = '" + int.Parse(listViewProdAddVenda.Items[i].SubItems[0].Text) + "'";

                        MySqlCommand comando = new MySqlCommand(sql, con);

                        reader = comando.ExecuteReader();

                        reader.Close();
                    }
                    btnLimparVenda_Click(null, null);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                MessageBox.Show("Venda Registrada!", "Information", MessageBoxButtons.OK, MessageBoxIcon.Information);
                carregaVarsProd(con, reader);
            }
        }
        private void comboDesconto_SelectedIndexChanged(object sender, EventArgs e)
        {
            textPrecoVenda.Text = "R$ " + ((1 - (float.Parse(comboDesconto.Text) / 100)) * (preco_venda)).ToString();
        }
        private void buttonBucaProd_Click(object sender, EventArgs e)
        {
            carregaVarsProd(con, reader);
        }
        private void quantProdVenda_ValueChanged(object sender, EventArgs e)
        {
            if(quantProdVenda.Value > int.Parse(listViewProdVenda.Items[listViewProdVenda.FocusedItem.Index].SubItems[5].Text))
            {
                MessageBox.Show("Não há essa quantidade de produto disponivel!", "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);

                quantProdVenda.Value = int.Parse(listViewProdVenda.Items[listViewProdVenda.FocusedItem.Index].SubItems[5].Text);
            }
        }
    }
}
